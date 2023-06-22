import React, { useState, useEffect } from 'react';
import { Modal, View, ScrollView, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

type Settings = {
    fontSize: number;
    speedUnit: string;
};

type SettingsModalProps = {
    onClose: () => void;
    onSave: (settings: Settings) => void;
    settings: Settings;
};

const speedUnits = ['Mph', 'Km/h', 'm/s'];

const SettingsModal: React.FC<SettingsModalProps> = ({
    onClose,
    onSave,
    settings,
}) => {
    const [fontSize, setFontSize] = useState<number>(settings.fontSize);
    const [speedUnit, setSpeedUnit] = useState<string>(settings.speedUnit);

    useEffect(() => {
        // Load settings when the modal becomes visible
        loadSettings();
    }, []);

    const loadSettings = async () => {
        // Load settings from AsyncStorage or any other storage mechanism
        // and set the state variables accordingly
        // Example using AsyncStorage:
        // const loadedSettings = await loadSettingsFromAsyncStorage();
        // if (loadedSettings) {
        //   setFontSize(loadedSettings.fontSize);
        //   setSpeed(loadedSettings.speed);
        // }
    };

    const handleSave = () => {
        const new_settings: Settings = {
            fontSize,
            speedUnit,
        };

        // Save settings to AsyncStorage or any other storage mechanism
        // Example using AsyncStorage:
        // await saveSettingsToAsyncStorage(settings);

        onSave(new_settings);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.sectionTitle}>Speed Units</Text>
                        {speedUnits.map((unit) => (
                            <TouchableOpacity
                                key={unit}
                                style={styles.option}
                                onPress={() => setSpeedUnit(unit)}
                            >
                                <Text style={styles.optionText}>{unit}</Text>
                                {speedUnit === unit && (
                                    <FontAwesome
                                        name="check"
                                        size={24}
                                        color="black"
                                        style={{ position: 'absolute', top: 10, right: 10 }}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.sectionTitle}>Font Size</Text>
                        <Picker
                            selectedValue={fontSize}
                            onValueChange={(itemValue: string | number) => setFontSize(itemValue as number)}
                        >
                            {Array.from(Array(150).keys()).map((i) => {
                                if (i >= 49)
                                    return (
                                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                    );
                            })}
                        </Picker>
                    </ScrollView>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <FontAwesome
                        name="close"
                        size={24}
                        color="black"
                        onPress={onClose}
                        style={{ position: 'absolute', top: 20, right: 20 }}
                    />
                </View>
            </View>

        </Modal>
    );
};

const styles: { [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle> } = {
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    option: {
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
};

export default SettingsModal;
