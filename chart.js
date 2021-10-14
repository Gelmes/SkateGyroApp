import React, {useEffect, useState, useRef, useCallback} from 'react';
import {SafeAreaView, TextInput, View, Dimensions} from 'react-native';
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
} from 'native-base';
import {LineChart} from 'react-native-chart-kit';

export default function Chart(props) {
  const {width, data} = props;
  return (
    <LineChart
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: data,
          },
        ],
      }}
      width={width} // from react-native
      height={330}
      yAxisLabel="+"
      yAxisSuffix="g"
      yAxisInterval={1} // optional, defaults to 1
      hidePointsAtIndex={[1]}
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#cccccc',
        backgroundGradientTo: '#888888',
        decimalPlaces: 1, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '4',
          strokeWidth: '2',
          stroke: '#06b6d4',
        },
      }}
      bezier
      style={{
        borderRadius: 10,
      }}
    />
  );
}
