import { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


import { isExist, saveSession, unsaveSession } from '@/services/savesService';
import { editSessionName, editSessionNotes } from '@/services/driveSessionService';
import { getCars } from '@/services/carService';

import { formatDateTime, formatDuration, formatDistance, formatDateNum, formatTimeOnly } from '@/utils/format';
import DriveSessionMap from '@/components/maps/DriveSessionMap';

import { SessionDetailsStyles } from '@/styles/SessionDetailsStyle';

import { VehicleObj } from '@/types/vehicleObj/VehicleType';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type SessionDetailsRouteProp = RouteProp<RootStackParamList, 'SessionDetails'>;

export default function SessionDetailsScreen() {
    const route = useRoute<SessionDetailsRouteProp>();
    const { session } = route.params;

    const [car, setCar] = useState<VehicleObj | null>(session.vehicle || null);
    const [isSaved, setIsSaved] = useState(false);

    const [title, setTitle] = useState(session.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(session.title);
    
    const [notes, setNotes] = useState(session.notes ?? '');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedNotes, setEditedNotes] = useState(session.notes ?? '');


    useEffect(() => {
        const check = async () => {
            const result = await isExist(session.id);
            setIsSaved(result);
        };

        check();
    }, [session]);

    const handleSave = async () => {
        await saveSession(session.id);
        setIsSaved(true);
    };

    const handleUnsave = async () => {
        await unsaveSession(session.id);
        setIsSaved(false);
    };

    const handleEditTitle = async () => {
        const trimmed = editedTitle.trim();

        if (!trimmed) return;

        await editSessionName(session.id, trimmed);
        setTitle(trimmed);
        setEditedTitle(trimmed);
        setIsEditingTitle(false);
    };

    const handleCancelEditTitle = () => {
        setEditedTitle(title);
        setIsEditingTitle(false);
    };


    const handleEditNotes = async () => {
        await editSessionNotes(session.id, editedNotes);
        setNotes(editedNotes);
        setIsEditingNotes(false);
    };

    const handleCancelEditNotes = () => {
        setEditedNotes(notes);
        setIsEditingNotes(false);
    };

    return (
        <ScrollView contentContainerStyle={SessionDetailsStyles.content}>
            <View style={SessionDetailsStyles.headerCard}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={SessionDetailsStyles.pageLabel}>Session Details</Text>
                    
                    {isSaved ? 
                        <Pressable onPress={handleUnsave}>
                            <Text>Unsave</Text>
                        </Pressable>
                    : 
                    
                        <Pressable onPress={handleSave}>
                            <Text>Save</Text>
                        </Pressable>
                    }
                </View>

                <View style={{ marginTop: 8 }}>
                    {isEditingTitle ? (
                        <View style={{ gap: 10, marginBottom: 20 }}>
                            <TextInput value={editedTitle} onChangeText={setEditedTitle} 
                                placeholder="Enter session title" style={SessionDetailsStyles.titleInput} />

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Pressable onPress={handleEditTitle} style={SessionDetailsStyles.saveTitleBtn}>
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                                </Pressable>

                                <Pressable onPress={handleCancelEditTitle} style={SessionDetailsStyles.cancelTitleBtn}>
                                    <Text style={{ fontWeight: '600' }}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={SessionDetailsStyles.inEditTitle}>
                            <Text style={[SessionDetailsStyles.title, { flex: 1 }]}>{title}</Text>

                            <Pressable onPress={() => setIsEditingTitle(true)} style={SessionDetailsStyles.editTitleBtn}>
                                <Ionicons name="create-outline" size={18} color="#333" />
                            </Pressable>
                        </View>
                    )}
                </View>

                <View style={SessionDetailsStyles.headerMetaRow}>
                    <View style={SessionDetailsStyles.headerMetaChip}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={SessionDetailsStyles.headerMetaText}>{formatDateNum(session.date)}</Text>
                    </View>

                    <View style={SessionDetailsStyles.headerMetaChip}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={SessionDetailsStyles.headerMetaText}>{formatDuration(session.timestamps.elapsedTime)}</Text>
                    </View>
                </View>
            </View>

            <View style={SessionDetailsStyles.statsRow}>
                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Distance</Text>
                    <Text style={SessionDetailsStyles.statValue}>{formatDistance(session.metrics.distance)}</Text>
                </View>

                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Avg Speed</Text>
                    <Text style={SessionDetailsStyles.statValue}>{session.metrics.speed.avgSpeed.toFixed(1)} km/h</Text>
                </View>

                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Altitude Gained</Text>
                    <Text style={SessionDetailsStyles.statValue}>{(session.metrics.altitude.altitudeGained ?? 0).toFixed(1)} m</Text>
                </View>
            </View>

            <View style={SessionDetailsStyles.detailsCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Drive Info</Text>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Saved At</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDateTime(new Date(session.date).getTime())}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Start Time</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDateNum(session.timestamps.timestampStart)} • {formatTimeOnly(session.timestamps.timestampStart)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>End Time</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDateNum(session.timestamps.timestampEnd)} • {formatTimeOnly(session.timestamps.timestampEnd)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Duration</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDuration(session.timestamps.elapsedTime)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Distance</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDistance(session.metrics.distance)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Average Speed</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.metrics.speed.avgSpeed.toFixed(1)} km/h
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Max Speed</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.metrics.speed.topSpeed?.speed ?? 0).toFixed(1)} km/h
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Route Points</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.mappedRoute?.length}
                    </Text> 
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Altitude Gained</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.metrics.altitude.altitudeGained ?? 0).toFixed(1)} m
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Max Altitude</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.metrics.altitude.topAltitude?.altitude ?? 0).toFixed(1)} m
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Car</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {car ? `${car.year} ${car.brand} ${car.model}` : '--'}
                    </Text>
                </View>
            </View>
            
            {/* Location */}
            <View style={SessionDetailsStyles.detailsCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Locations</Text>

                <View style={SessionDetailsStyles.locationBlock}>
                    <View style={SessionDetailsStyles.locationHeader}>
                        <Ionicons name="play-circle" size={18} color="green" />
                        <Text style={SessionDetailsStyles.locationTitle}>Start Location</Text>
                    </View>

                    <Text style={SessionDetailsStyles.locationText}>
                        {session.locations.startLocation.name?.trim() ? session.locations.startLocation.name : session.locations.startLocation.coords 
                            ? `${session.locations.startLocation.coords.latitude.toFixed(6)}, ${session.locations.startLocation.coords.longitude.toFixed(6)}`
                            : '--'}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.locationBlock}>
                    <View style={SessionDetailsStyles.locationHeader}>
                        <Ionicons name="stop-circle" size={18} color="red" />
                        <Text style={SessionDetailsStyles.locationTitle}>End Location</Text>
                    </View>

                    <Text style={SessionDetailsStyles.locationText}>
                        {session.locations.endLocation.name?.trim() ? session.locations.endLocation.name : session.locations.endLocation.coords
                            ? `${session.locations.endLocation.coords.latitude.toFixed(6)}, ${session.locations.endLocation.coords.longitude.toFixed(6)}`
                            : '--'}
                    </Text>
                </View>
            </View>
            
            {/* Map */}
            <View style={SessionDetailsStyles.mapCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Saved Route</Text>

                <DriveSessionMap
                    title=""
                    locStart={session.locations.startLocation.coords || null}
                    locEnd={session.locations.endLocation.coords || null}
                    route={session.mappedRoute || []}
                    mapStyle={{ height: 260 }}
                    wrapperStyle={SessionDetailsStyles.mapWrapperOverride}
                    checkpoints={session?.checkpoints}
                    previewOnly={true}
                    timeStart={session.timestamps.timestampStart}
                    timeEnd={session.timestamps.timestampEnd}
                    distance={session.metrics.distance}
                />
            </View>
            
            {/* Notes */}
            <View style={SessionDetailsStyles.detailsCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Notes</Text>

                <View style={SessionDetailsStyles.locationBlock}>
                    {isEditingNotes ? (
                        <View style={{ gap: 10 }}>
                            <TextInput value={editedNotes} onChangeText={setEditedNotes} placeholder="Enter notes"
                                multiline textAlignVertical="top" style={SessionDetailsStyles.noteInput} />

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Pressable onPress={handleEditNotes}>
                                    <Text style={{ fontWeight: '600' }}>Save</Text>
                                </Pressable>

                                <Pressable onPress={handleCancelEditNotes}>
                                    <Text style={{ color: '#888' }}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <Pressable onPress={() => setIsEditingNotes(true)}>
                            <Text style={SessionDetailsStyles.detailLabel}>
                                {notes?.trim() ? notes : 'No notes'}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({});