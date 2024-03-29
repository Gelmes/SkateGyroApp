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
  useLayoutEffect,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
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
  Spinner,
  extendTheme,
  KeyboardAvoidingView,
} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {styles} from './Style.js';

import DevicesScreen from './devicesScreen';
import SkateGyroScreen from './skateGyroScreen';
import DeviceScreen from './deviceScreen';
import {BleManager} from 'react-native-ble-plx';

const NavStack = createNativeStackNavigator();

function App() {
  const bleManager = new BleManager();
  const theme = extendTheme({
    components: {
      Button: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'lg',
          size: 'lg',
        },
      },
      Input: {
        baseStyle: {
          rounded: 'lg',
        },
        defaultProps: {
          size: 'lg',
          borderRadius: 10,
        },
      },
      TextArea: {
        baseStyle: {
          rounded: 'lg',
          size: 'lg',
        },
        defaultProps: {
          size: 'lg',
          borderRadius: 10,
        },
      },
    },
  });
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <NavStack.Navigator initialRouteName="SkateGyro">
          <NavStack.Screen
            name="SkateGyro"
            component={SkateGyroScreen}
            initialParams={{
              bleManager: bleManager,
            }}
          />
          <NavStack.Screen
            name="Devices"
            component={DevicesScreen}
            initialParams={{
              bleManager: bleManager,
            }}
          />
          <NavStack.Screen
            name="Device"
            component={DeviceScreen}
            initialParams={{
              bleManager: bleManager,
            }}
          />
        </NavStack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;
