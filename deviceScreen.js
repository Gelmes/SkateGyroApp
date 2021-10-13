
import React, {
  useState,
  useEffect
} from 'react';

import {
  SafeAreaView
} from 'react-native';

import {
  Text,
  Button,
  HStack,
  FlatList,
  Spinner
} from 'native-base';

import { BleManager } from 'react-native-ble-plx';

export function DeviceList({devices}){
  const deviceList = Object.keys(devices).reduce((array, key) => {
    return [...array, {id: devices[key].id, name:devices[key].name}]
  }, [])

  const map = item => (
    <Button borderWidth={1} borderColor="gray.100" bgColor="white">
      <Text>{item.name}</Text>
      <Text>{item.id}</Text>
    </Button> 
  )

  return (
    <FlatList data={deviceList} renderItem={ ({item}) => (
      map(item)
    )} />
  )
}

export default function DevicesScreen({route, navigation}) {
  const [count, setCount] = useState(0);
  const [devices, setDevices] = useState({});
  const [bleManager, setBleManager] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  async function startScan(){
    if(bleManager == null){
      setBleManager(new BleManager()); 
      return
    }
    setIsScanning(true)
    console.log("Start Scan Effect starting scan")
    let tempDevices = {}
    setTimeout(async () => {
      setIsScanning(false)
      console.log("Stop scan 2")
      await bleManager.stopDeviceScan()
      setDevices({...devices, ...tempDevices});
    }, 5000)

    bleManager.startDeviceScan([], {}, (error, device) => {
      if(error){
        console.log(error)
      }
      setCount(count + 1)
      tempDevices[device.id] = device;
    })

  }

  async function stopScan() {
    setIsScanning(false)
    if(bleManager){
      console.log("Stop scan 1")
      await bleManager.stopDeviceScan()
    }
  }

  useEffect (() => {
    console.log("Manager effect")
    if(bleManager){
      startScan()
    }
  }, [bleManager])  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack space={3}>
          <Spinner size="lg" animating={isScanning} />
          <Button onPress={() => startScan()}>Scan</Button>
          <Button onPress={() => stopScan()}>Stop</Button>
        </HStack>
      ),
    })
  }, [navigation, isScanning]);

  return (
    <SafeAreaView>
      <DeviceList devices={devices} />
    </SafeAreaView>
  );
}
