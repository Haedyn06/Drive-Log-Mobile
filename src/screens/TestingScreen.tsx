import { useEffect, useMemo, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { dbTest, copyDbForDebug, importData, migratePinnedLocations } from '@/services/sessiondbService';

import { TestingStyles } from '@/styles/TestingStyle';

function TestButtons () {
    const handleDBTest = async () => await dbTest();


    return (
        <View>
            <Pressable style={TestingStyles.btn} onPress={handleDBTest}>
                <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >DB Test</Text>
            </Pressable>

            <Pressable style={TestingStyles.btn} onPress={copyDbForDebug}>
                <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Get DB</Text>
            </Pressable>

            <Pressable style={TestingStyles.btn} onPress={importData}>
                <Text style={{fontSize: 18, color:'white', textAlign: 'center', fontWeight: 'bold'}} >Import To DB</Text>
            </Pressable>
        </View>
    );
}

function TestBottomSheet () {
    const snapPoints = useMemo(() => ['20%', '70%'], []);

    return (
        <View style={TestingStyles.container}>
            <BottomSheet snapPoints={snapPoints}>
                <BottomSheetView style={{ flex: 1, padding: 20 }}>

                    <Text>Test</Text>

                </BottomSheetView>
            </BottomSheet>
        </View> 
    );


}


export default function TestingScreen() {

    return (
        <View style={TestingStyles.container}>
            <View>
            </View>
        </View>
    );
}