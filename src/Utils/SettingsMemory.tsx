import AsyncStorage from '@react-native-async-storage/async-storage';

export type Settings = {
  fontSize: number;
  speedUnit: string;
};

export const defaultSettings: Settings = {
    fontSize: 80,
    speedUnit: "Km/h",
};

const MEMORY_KEY = 'SETTINGS_MEMORY';

// Load settings from AsyncStorage
export async function loadSettings(): Promise<Settings> {
  try {
    const settingsData = await AsyncStorage.getItem(MEMORY_KEY);
    if (settingsData) {
      const settings = JSON.parse(settingsData) as Settings;
      return settings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  return {
    fontSize: 80,
    speedUnit: "Km/h",
  };
}

// Save settings to AsyncStorage
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const settingsData = JSON.stringify(settings);
    await AsyncStorage.setItem(MEMORY_KEY, settingsData);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

