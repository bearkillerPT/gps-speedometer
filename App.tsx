import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';

import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
} from 'react-native-cool-speedometer';
import * as ScreenOrientation from 'expo-screen-orientation';

interface LocationData {
  coords: {
    speed: number;
  };
}

const App = () => {
  const [locationObject, setLocationObject ] = useState<Location.LocationObject | undefined>(undefined);
  const [isPortrait, setIsPortrait] = useState<boolean>(true);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 200,
          distanceInterval: 0,
        },
        (location: Location.LocationObject) => {
          if (location.coords && location.coords.speed && location.coords.speed > 0) {
            setLocationObject({...location, 
              coords: {
                ...location.coords,
                speed: location.coords.speed * 3.6,
              }
            });
          } 
        }
      );
    };

    getLocation();
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setIsPortrait(event.orientationInfo.verticalSizeClass === 2);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  const deviceWidth = Dimensions.get('window') ? isPortrait ? Dimensions.get('window').width * 0.8 : Dimensions.get('window').width * 0.4 : 300
  const deviceHeight = Dimensions.get('window') ? isPortrait ? Dimensions.get('window').width * 0.8 : Dimensions.get('window').width * 0.4 : 300
  return (
    <ImageBackground
      source={require('./assets/dark_night_sky.jpg')}
      resizeMode='stretch'
    >
      <View style={[styles.container, {
        flexDirection: isPortrait ? 'column' : 'row-reverse',
        justifyContent: isPortrait ? 'center' : 'space-evenly',
      }]}>
        <Speedometer
          width={deviceWidth}
          height={deviceHeight}
          value={locationObject?.coords?.speed || 0}
          accentColor='rgb(100, 0, 8)'
          >
          <Background 
            color='rgba(0, 90, 0, .6)'
          />
          <Arc 
          stroke={'white'} />
          <Needle 
          color='rgb(200, 0, 32)' />
          <Progress />
          <Marks />
        </Speedometer>
        <View style={[styles.textContainer, {
          marginRight: isPortrait ? 0 : 50,
        }]}>
          <Text style={styles.speed} >{(locationObject?.coords.speed ?? 0).toFixed(0)}</Text>
          <Text style={styles.speedUnit} >Km/h</Text>
          <View>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Latitude:     {locationObject?.coords.latitude.toFixed(6) ?? "waiting..."}</Text>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Longitude: {locationObject?.coords.longitude.toFixed(6) ?? "waiting..."} </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  speed: {
    color: 'white',
    fontSize: 90,
    fontWeight: 'bold',
  },
  speedUnit: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
