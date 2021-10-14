import React, {useEffect, useState, useRef, useCallback} from 'react';
import {SafeAreaView, TextInput, Dimensions} from 'react-native';
import {
  Text,
  Input,
  TextArea,
  HStack,
  Button,
  ScrollView,
  NativeBaseProvider,
  Box,
  VStack,
  KeyboardAvoidingView,
} from 'native-base';
import base64 from 'react-native-base64';
import Chart from './chart';

// NOTE: Debugging notes
// https://github.com/dotintent/react-native-ble-plx/issues/744
// https://github.com/dotintent/react-native-ble-plx/issues/744
// http://denethor.wlu.ca/arduino/MLT-BT05-AT-commands-TRANSLATED.pdf
// https://www.novelbits.io/uuid-for-custom-services-and-characteristics/
export default function DeviceScreen({route, navigation}) {
  const {bleManager, device} = route.params;

  const [value, setValue] = useState('');
  const [messages, setMessages] = useState('');
  const [chartWidth, setChartWidth] = useState(
    Dimensions.get('window').width - 15,
  );
  const scrollable = useRef(null);

  let theDevice = {};
  const connectToDevice = async () => {
    console.log('Connecting to device');

    let connected = await bleManager.isDeviceConnected(device.id);
    console.log('Discovery connected', connected);
    if (connected) {
      theDevice = await bleManager.cancelDeviceConnection(device.id);
    }

    try {
      console.log('connect');
      theDevice = await bleManager.connectToDevice(device.id);
      console.log('is connected?');
      let connected = await bleManager.isDeviceConnected(device.id);
      console.log('Is connected', connected);
      console.log('Device keys', Object.keys(theDevice));
      console.log(
        'Discover Services',
        await theDevice.discoverAllServicesAndCharacteristics(),
      );
      const services = Object.values(await theDevice.services());
      const characteristics = {};

      for (let i = 0; i < services.length; i++) {
        characteristics[services[i].uuid] =
          await theDevice.characteristicsForService(services[i].uuid);
      }

      console.log('Service UUIDS', Object.keys(characteristics));
      console.log('Characteristic', Object.keys(characteristics));

      let message = base64.encode('Some string to encode to base64');
      let writeResult =
        await theDevice.writeCharacteristicWithResponseForService(
          '0000ffe0-0000-1000-8000-00805f9b34fb',
          '0000ffe1-0000-1000-8000-00805f9b34fb',
          message,
        );
      console.log('Write result ', writeResult);
      let state = await bleManager.state();
      console.log('State', state, theDevice);
    } catch (error) {
      console.log('Connection error', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({title: device.name});
  }, [device]);

  useEffect(() => {
    scrollable.current.scrollToEnd();
  }, [messages]);

  const handleSubmit = () => {
    setMessages(messages + '\n' + value);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={async () => {
            connectToDevice();
          }}>
          Connect
        </Button>
      ),
    });
  }, [navigation]);

  function handleViewLayout(event) {
    const {x, y, width, height} = event.nativeEvent.layout;
    setChartWidth(width);
  }

  return (
    <SafeAreaView>
      <VStack m={2} onLayout={handleViewLayout}>
        <ScrollView ref={scrollable}>
          <VStack space={2}>
            <Chart width={chartWidth} />
            <TextArea bgColor="white" isReadOnly={true}>
              {messages}
            </TextArea>
            <HStack space={2}>
              <Input
                flex={1}
                onChangeText={setValue}
                bgColor="white"
                value={value}
                onSubmitEditing={handleSubmit}
                autoFocus={true}
                keyboardType="number-pad"
              />
              <Button onPress={handleSubmit}>Submit</Button>
            </HStack>
            <Text>{device.id}</Text>
          </VStack>
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}
