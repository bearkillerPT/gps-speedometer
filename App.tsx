import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [speed, setSpeed] = useState<number>(0);
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
            setSpeed(location.coords.speed * 3.6);
          } else {
            setSpeed(0);
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


  return (
    <View style={[styles.container, {
      flexDirection: isPortrait ? 'column' : 'row-reverse',
      justifyContent: isPortrait ? 'center' : 'space-evenly',
    }]}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
      <Speedometer
        width={isPortrait ? 400 : 400}
        height={isPortrait ? 400 : 400}
        value={speed}
      >
        <Background />
        <Arc />
        <Needle />
        <Progress />
        <Marks />
      </Speedometer>
      <View style={styles.textContainer}>
        <Text style={styles.speed} >{speed.toFixed(0)}</Text>
        <Text style={styles.speed} >km/h</Text>
      </View>
    </View>
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

  },
  speed: {
    color: 'white',
    fontSize: 70,
    fontWeight: 'bold',
  },
});

export default App;
