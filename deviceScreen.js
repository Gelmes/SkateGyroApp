import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {Text} from 'native-base';

export default function DeviceScreen({route, navigation}) {
  const {bleManager, device} = route.params;
  useEffect(() => {
    navigation.setOptions({title: device.name});
  }, [device]);

  return (
    <SafeAreaView>
      <Text>{device.id}</Text>
    </SafeAreaView>
  );
}
