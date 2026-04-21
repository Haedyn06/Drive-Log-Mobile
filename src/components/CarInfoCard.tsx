import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import { Ionicons } from "@expo/vector-icons";


type CarInfoCardProps = {
    carYear: string;
    carBrand: string;
    carModel: string;
    carColor: string;
    carLicense: string;
    onDelete: () => void;
};

export default function CarInfoCard({carYear, carBrand, carModel, carColor, carLicense, onDelete}: CarInfoCardProps) {
    return(
        <View style={styles.carCardContainer}>
            <View>
                <Text style={styles.carInfoTitle}>{carYear} {carBrand} {carModel}</Text>
                <Text style={styles.carInfoDesc}>{carColor}{carLicense ? `, ${carLicense}` : ''}</Text>  

            </View>
            
            <Pressable style={styles.trashBtn} onPress={onDelete}>
                <Ionicons name="trash-outline" size={22} color="#eb2525" />
            </Pressable>
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