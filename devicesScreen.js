import React, {useState, useEffect, useContext} from 'react';

import {SafeAreaView} from 'react-native';

import {Text, Button, HStack, FlatList, Spinner} from 'native-base';

export function Device(props) {
  const {device, onPress} = props;
  return (
    <Button
      borderWidth={1}
      borderColor="gray.100"
      bgColor="white"
      onPress={() => {
        console.log('Button', device.id, device.name);
        onPress(device);
      }}>
      <Text>{device.name}</Text>
      <Text>{device.id}</Text>
    </Button>
  );
}

export function DeviceList({devices, navigation, bleManager}) {
  const deviceList = Object.keys(devices).reduce((array, key) => {
    return [...array, {id: devices[key].id, name: devices[key].name}];
  }, []);

  function handleClick(device) {
    navigation.navigate('Device', {bleManager: bleManager, device: device});
  }

  const map = item => (
    <Device device={item} onPress={item => handleClick(item)} />
  );

  return <FlatList data={deviceList} renderItem={({item}) => map(item)} />;
}

export default function DevicesScreen({route, navigation}) {
  const {bleManager} = route.params;
  const [count, setCount] = useState(0);
  const [devices, setDevices] = useState({});
  // const [bleManager, setBleManager] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  async function startScan() {
    setIsScanning(true);
    console.log('Start Scan Effect starting scan');
    let tempDevices = {};

    // Scan the devices and store results to the list
    bleManager.startDeviceScan([], {}, (error, device) => {
      if (error) {
        console.log(error);
      }
      setCount(count + 1);
      tempDevices[device.id] = device;
    });

    // After several seconds stop the scan and render the results
    setTimeout(async () => {
      setIsScanning(false);
      console.log('Stop scan 2');
      await bleManager.stopDeviceScan();
      setDevices({...devices, ...tempDevices});
    }, 3000);
  }

  async function stopScan() {
    setIsScanning(false);
    if (bleManager) {
      console.log('Stop scan 1');
      await bleManager.stopDeviceScan();
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack space={3}>
          <Spinner size="lg" animating={isScanning} />
          <Button
            onPress={async () => {
              startScan();
            }}>
            Scan
          </Button>
          <Button onPress={() => stopScan()}>Stop</Button>
        </HStack>
      ),
    });
  }, [navigation, isScanning]);

  return (
    <SafeAreaView>
      <DeviceList
        devices={devices}
        navigation={navigation}
        bleManager={bleManager}
      />
    </SafeAreaView>
  );
}
