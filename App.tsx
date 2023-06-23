import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
} from 'react-native-cool-speedometer';
import * as ScreenOrientation from 'expo-screen-orientation';
import SettingsModal from './src/Components/SettingsModal';
import { Settings, defaultSettings, loadSettings, saveSettings } from './src/Utils/SettingsMemory';

const App = () => {
  const [locationObject, setLocationObject] = useState<Location.LocationObject | undefined>(undefined);
  const [isPortrait, setIsPortrait] = useState<boolean>(true);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  // BRRR
  const [focusMode, setFocusMode] = useState<boolean>(false);

  useEffect(() => {
    loadSettings().then((loadedSettings) => {
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    });
  }, []);
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
            setLocationObject({
              ...location,
              coords: {
                ...location.coords,
                speed: calculateSpeed(location.coords.speed, settings),
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

  const calculateSpeed = (speed: number, settings: Settings) => {
    switch (settings.speedUnit) {
      case 'Km/h':
        return speed * 3.6;
      case 'm/s':
        return speed * 1;
      case 'Mph':
        return speed * 2.236936;
      default:
        return speed * 3.6;
    }
  };
  return (
    <TouchableOpacity activeOpacity={1} onPress={
      () => {
        setFocusMode(!focusMode);
        setSettings({
          ...settings,
          fontSize: !focusMode ? settings.fontSize * 1.8 : settings.fontSize / 1.8,
        });
      }
    }>
      <ImageBackground
        source={require('./assets/dark_night_sky.jpg')}
        resizeMode='stretch'
      >
        {isSettingsModalVisible &&
          <SettingsModal
            onClose={() => setIsSettingsModalVisible(false)}
            onSave={(settings) => {
              saveSettings(settings).then(() => {
                setSettings(settings);
              });
            }}
            settings={settings}
          />}
        <View style={[styles.container, {
          flexDirection: isPortrait ? 'column' : 'row-reverse',
          justifyContent: isPortrait ? 'center' : 'space-evenly',
        }]}>
          {!focusMode &&
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
            </Speedometer>}
          <View style={[styles.textContainer, {
            marginRight: isPortrait ? 0 : 50,
          }]}>
            <Text numberOfLines={1} allowFontScaling adjustsFontSizeToFit style={[styles.speed, {
              fontSize: settings?.fontSize ?? 80,
            }]} >{(locationObject?.coords.speed ?? 0).toFixed(0)}</Text>
            <Text style={styles.speedUnit} >{settings.speedUnit}</Text>
            <View>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Latitude:     {locationObject?.coords.latitude.toFixed(6) ?? "waiting..."}</Text>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Longitude: {locationObject?.coords.longitude.toFixed(6) ?? "waiting..."} </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      {!isSettingsModalVisible &&
        <FontAwesome name="gear" size={40} color="white" style={{
          position: 'absolute',
          top: 50,
          right: 25,
        }} onPress={() => {
          setIsSettingsModalVisible(true);
        }} />
      }
    </TouchableOpacity>
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
