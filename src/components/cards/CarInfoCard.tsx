import { useState } from 'react';
import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import ConfirmationPopup from '@/components/ConfirmationPopup';

type CarInfoCardProps = {
    carYear: string;
    carBrand: string;
    carModel: string;
    carColor: string;
    carLicense: string;
    onDelete: () => void;
};

export default function CarInfoCard({carYear, carBrand, carModel, carColor, carLicense, onDelete}: CarInfoCardProps) {
    const [showPopup, setShowPopup] = useState(false);

    return(
        <View style={styles.carCardContainer}>
            <View>
                <Text style={styles.carInfoTitle}>{carYear} {carBrand} {carModel}</Text>
                <Text style={styles.carInfoDesc}>{carColor}{carLicense ? `, ${carLicense}` : ''}</Text>  

            </View>
            
            <Pressable style={styles.trashBtn} onPress={() => setShowPopup(true)}>
                <Ionicons name="trash-outline" size={22} color="#eb2525" />
            </Pressable>

            <ConfirmationPopup
                visible={showPopup}
                label="delete this car"
                onCancel={() => setShowPopup(false)}
                onConfirm={() => {
                    onDelete();
                    setShowPopup(false);
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    carCardContainer: {
        borderBottomWidth: 1,
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    carInfoTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },

    carInfoDesc: {
        marginTop: 4,
        fontSize: 14
    },

    trashBtn: {
        alignSelf: 'center'
    }
});