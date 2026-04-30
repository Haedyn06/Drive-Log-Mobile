import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { v4 as uuidv4 } from 'uuid';

import { savePinnedLocationDB } from '@/database/methods';

import FieldLabel from '@/components/FieldLabel';
import { Coords } from '@/types/CoordinateType';


type PinLocationMappedProps = {
    visible: boolean;
    onClose: () => void;
    location: Coords;
};
export default function PinLocationMapped({ visible, onClose, location }: PinLocationMappedProps) {
    const [locName, setLocName] = useState('');
    const [locNotes, setLocNotes] = useState('');


    const handleSave = async () => {
        await savePinnedLocationDB(uuidv4(), locName, locNotes, location)
        console.log('saved ' + location.latitude + ', ' + location.longitude);
        onClose();

        setLocName('');
        setLocNotes('');
    };

    const handleClose = () => {
        onClose();

        setLocName('');
        setLocNotes('');
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Pin Your Location</Text>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.formContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FieldLabel title="Location Name" />
                        <TextInput
                            value={locName}
                            onChangeText={setLocName}
                            placeholder="Name"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />

                        <FieldLabel title="Notes" />
                        <TextInput
                            value={locNotes}
                            onChangeText={setLocNotes}
                            placeholder="Notes"
                            placeholderTextColor="#9ca3af"
                            style={styles.modalInput}
                        />
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <Pressable style={styles.cancelBtn} onPress={handleClose}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>

                        <Pressable style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.28)',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },

    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        overflow: 'hidden',
        maxHeight: '88%',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2f7',
    },

    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
        letterSpacing: -0.3,
    },

    modalSubtitle: {
        fontSize: 13,
        lineHeight: 19,
        color: '#6b7280',
    },

    formContent: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 18,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 14,
        color: '#111827',
        fontSize: 15,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eef2f7',
        backgroundColor: '#ffffff',
    },

    cancelBtn: {
        flex: 1,
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    cancelBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4b5563',
    },

    saveBtn: {
        flex: 1.2,
        minHeight: 48,
        borderRadius: 16,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveBtnText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
    },
});