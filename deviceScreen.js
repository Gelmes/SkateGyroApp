

function DeviceList({devices}){
    const deviceList = Object.keys(devices).reduce((array, key) => {
      return [...array, {id: devices[key].id, name:devices[key].name}]
    }, [])
    console.log("New devices", deviceList)
  
    const map = item => (
      <Button borderWidth={1} borderColor="gray.300" bgColor="white">
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
    const [bleAllowed, setBleAllowed] = useState(false);
  
    const startScan = () =>{
      console.log("Start Scan Effect starting scan")
      let tempDevices = {}
      setTimeout(async () => {
        console.log("Stop scan")
        await bleManager.stopDeviceScan()
        setDevices({...devices, ...tempDevices});
        console.log(Object.keys(tempDevices))
      }, 5000)
  
      bleManager.startDeviceScan([], {}, (error, device) => {
        if(error){
          console.log(error)
        }
        setCount(count + 1)
        // console.log(device.id)
        // devices[device.id] = device
        // setDevices([...devices, device]);
        // setDevices({...devices, [device.id]:device});
        // console.log(Object.keys(devices))
  
        tempDevices[device.id] = device;
        // console.log(Object.keys(tempDevices))
        // console.log(devices)
      
      })
  
    }
  
    useLayoutEffect (() => {
      if(bleAllowed == true){
        console.log("Effect starting scan")
        let tempDevices = {}
        bleManager.startDeviceScan([], {}, (error, device) => {
          if(error){
            console.log(error)
          }
          setCount(count + 1)
          // console.log(device.id)
          // devices[device.id] = device
          // setDevices({...devices, [device.id]:device});
          // setDevices([...devices, device]);
          tempDevices[device.id] = device;
          console.log(Object.keys(tempDevices))
          // console.log(devices)
        
        })
      }
    }, [bleAllowed])
  
    const bleScanStop = async () => {
      if(bleManager){
        console.log("Stop scan")
        setBleAllowed(false)
        bleManager.stopDeviceScan()
      }
    }
  
    const bleScan = async () => {    
      console.log("Scan")
      if (Platform.OS === 'android' && Platform.Version >= 23) {
          if( 
            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) || 
            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) || 
            await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          ){
            console.log("Permission is OK");
            setBleManager(new BleManager())
            startScan()
            // setBleAllowed(true)
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
  
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <HStack space={3}>
            <Button onPress={bleScan}>Scan</Button>
            <Button onPress={bleScanStop}>Stop</Button>
          </HStack>
        ),
      })
    }, [navigation]);
  
    return (
      <SafeAreaView>
        <DeviceList devices={devices} />
      </SafeAreaView>
    );
  }