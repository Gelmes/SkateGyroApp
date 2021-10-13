/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
  useState,
  useEffect,
  createContext,
  useLayoutEffect
}
from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView
} from 'react-native';

import {
  NativeBaseProvider,
  Text,
  Button,
  Icon,
  HamburgerIcon,
  HStack,
  Box,
  Heading,
  AspectRatio,
  Image,
  Center,
  Stack,
  VStack,
  usePropsResolution,
  FlatList,
  ScrollView,
  Spinner
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from './Style.js';
import { BleManager } from 'react-native-ble-plx';

export const Logo = () => {
  return (
    <HStack space={2}>
      <HamburgerIcon size="5" mt="0.5" color="gray.500" />
    </HStack>
  )
}
function TitleImage(){
  return(
    <Box>
    <AspectRatio>
    <Image
        source={{
          uri: "https://wallpaperaccess.com/full/317501.jpg",
        }}
        alt="image"
        />
    </AspectRatio>
    </Box>
    )
}

function BottomHome(props){
  return(
    <Center>
    <Stack p="4" space={5}>
      <Stack space={2}>
        <Text>
          The Silicon Valley of India.

        </Text>
        <Button onPress={() => props.onClick()}>Scan Devices</Button>
      </Stack>
    </Stack>
    </Center>
  )
}

function SkateGyroScreen({navigation}) {
  const getPermissions = async () =>{
    console.log("Getting Permissions") 
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        if( 
          await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) || 
          await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) || 
          await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        ){
          console.log("Permission is OK");
        } else{
          console.log("Permission is ERROR");
          let result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
          console.log(result)
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT)
          console.log(result)
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          console.log(result)
        }
    }
  }

  const handleClick = async () => {
    await getPermissions();
    navigation.navigate("Devices");
  }

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      
    >
      <TitleImage />
      <BottomHome onClick={handleClick} />
    </Box>
  );
}

function DeviceList({devices}){
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

function DevicesScreen({route, navigation}) {
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

const NavStack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
    <NativeBaseProvider>
      <NavStack.Navigator initialRouteName="SkateGyro">
        <NavStack.Screen name="SkateGyro" component={SkateGyroScreen} />
        <NavStack.Screen name="Devices" component={DevicesScreen} />
      </NavStack.Navigator>
    </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;
