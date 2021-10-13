import React from 'react';

import {PermissionsAndroid, Platform, SafeAreaView} from 'react-native';

import {
  Text,
  Button,
  Box,
  AspectRatio,
  Image,
  Center,
  Stack,
} from 'native-base';

function TitleImage() {
  return (
    <Box>
      <AspectRatio>
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt="image"
        />
      </AspectRatio>
    </Box>
  );
}

function BottomHome(props) {
  return (
    <Center>
      <Stack p="4" space={5}>
        <Stack space={2}>
          <Text>The Silicon Valley of India.</Text>
          <Button onPress={() => props.onClick()}>Scan Devices</Button>
        </Stack>
      </Stack>
    </Center>
  );
}

export default function SkateGyroScreen({navigation}) {
  const getPermissions = async () => {
    console.log('Getting Permissions');
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      if (
        (await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        )) ||
        (await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        )) ||
        (await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ))
      ) {
        console.log('Permission is OK');
      } else {
        console.log('Permission is ERROR');
        let result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        console.log(result);
        result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        console.log(result);
        result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(result);
      }
    }
  };

  const handleClick = async () => {
    await getPermissions();
    navigation.navigate('Devices');
  };

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1">
      <TitleImage />
      <BottomHome onClick={handleClick} />
    </Box>
  );
}
