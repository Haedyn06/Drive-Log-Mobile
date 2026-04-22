import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import FieldLabel from '@/components/FieldLabel';

import type { CarInfo } from '@/types/CarInfo';

type SaveSessionModalProps = {
    visible: boolean;
    sessionTitle: string;
    setSessionTitle: React.Dispatch<React.SetStateAction<string>>;

    startLocationLabel: string;
    setStartLocationLabel: React.Dispatch<React.SetStateAction<string>>;

    endLocationLabel: string;
    setEndLocationLabel: React.Dispatch<React.SetStateAction<string>>;

    cars: CarInfo[];
    selectedCar: string;
    setSelectedCar: React.Dispatch<React.SetStateAction<string>>;

    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>;

    onClose: () => void;
    onSave: () => void;
};

export default function SaveSessionModal({
    visible,
    sessionTitle,
    setSessionTitle,
    startLocationLabel,
    setStartLocationLabel,
    endLocationLabel,
    setEndLocationLabel,
    cars,
    selectedCar,
    setSelectedCar,
    notes,
    setNotes,
    onClose,
    onSave,
}: SaveSessionModalProps) {
    const [showCarDropdown, setShowCarDropdown] = useState(false);

    const selectedCarLabel = useMemo(() => {
        const car = cars.find((c) => c.id === selectedCar);
        return car ? `${car.year} ${car.brand} ${car.model}` : 'None';
    }, [cars, selectedCar]);

    const handleSelectCar = (carId: string) => {
        setSelectedCar(carId);
        setShowCarDropdown(false);
    };

    const handleSave = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSave();
    } 

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={styles.backdropPress}
                    onPress={() => {
                        if (showCarDropdown) {
                            setShowCarDropdown(false);
                        }
                    }}
                >
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.eyebrow}>Session Details</Text>
                                <Text style={styles.modalTitle}>Save Drive Session</Text>
                                <Text style={styles.modalSubtitle}>
                                    Add a title, location info, choose a saved car, and keep notes.
                                </Text>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.formContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <FieldLabel title="Session Title" />
                            <TextInput
                                value={sessionTitle}
                                onChangeText={setSessionTitle}
                                placeholder="Night Drive"
                                placeholderTextColor="#9ca3af"
                                style={styles.modalInput}
                            />

                            <FieldLabel title="Start Location" optional />
                            <TextInput
                                value={startLocationLabel}
                                onChangeText={setStartLocationLabel}
                                placeholder="Downtown Calgary"
                                placeholderTextColor="#9ca3af"
                                style={styles.modalInput}
                            />

                            <FieldLabel title="End Location" optional />
                            <TextInput
                                value={endLocationLabel}
                                onChangeText={setEndLocationLabel}
                                placeholder="Banff Ave"
                                placeholderTextColor="#9ca3af"
                                style={styles.modalInput}
                            />

                            <FieldLabel title="Car Driven" optional />
                            <View style={styles.dropdownSection}>
                                <Pressable
                                    style={styles.dropdownTrigger}
                                    onPress={() => setShowCarDropdown((prev) => !prev)}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownTriggerText,
                                            !selectedCar && styles.dropdownPlaceholderText,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {selectedCarLabel}
                                    </Text>

                                    <Text style={styles.dropdownArrow}>
                                        {showCarDropdown ? '▲' : '▼'}
                                    </Text>
                                </Pressable>

                                {showCarDropdown && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView
                                            nestedScrollEnabled
                                            showsVerticalScrollIndicator={false}
                                        >
                                            <Pressable
                                                style={styles.dropdownItem}
                                                onPress={() => handleSelectCar('')}
                                            >
                                                <Text style={styles.dropdownItemText}>None</Text>
                                            </Pressable>

                                            {cars.map((car) => (
                                                <Pressable
                                                    key={car.id}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selectedCar === car.id &&
                                                            styles.dropdownItemSelected,
                                                    ]}
                                                    onPress={() => handleSelectCar(car.id)}
                                                >
                                                    <Text style={styles.dropdownItemText}>
                                                        {car.year} {car.brand} {car.model}
                                                    </Text>
                                                    {!!car.license && (
                                                        <Text style={styles.dropdownItemSubtext}>
                                                            {car.license}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <FieldLabel title="Notes" optional />
                            <TextInput
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Road was icy, stopped for gas, nice sunset..."
                                placeholderTextColor="#9ca3af"
                                style={[styles.modalInput, styles.notesInput]}
                                multiline
                                textAlignVertical="top"
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <Pressable style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>Save Session</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
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

    backdropPress: {
        flex: 1,
        justifyContent: 'center',
    },

    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        overflow: 'visible',
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

    dropdownSection: {
        marginBottom: 14,
        position: 'relative',
        zIndex: 50,
    },

    dropdownTrigger: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dropdownTriggerText: {
        flex: 1,
        color: '#111827',
        fontSize: 15,
        marginRight: 10,
    },

    dropdownPlaceholderText: {
        color: '#9ca3af',
    },

    dropdownArrow: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '700',
    },

    dropdownMenu: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        maxHeight: 220,
        overflow: 'hidden',
    },

    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },

    dropdownItemSelected: {
        backgroundColor: '#eff6ff',
    },

    dropdownItemText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },

    dropdownItemSubtext: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },

    notesInput: {
        minHeight: 96,
        maxHeight: 140,
        paddingTop: 13,
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