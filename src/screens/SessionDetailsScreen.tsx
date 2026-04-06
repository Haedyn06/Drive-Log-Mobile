import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { formatDateTime, formatDuration, formatDistance, formatDateNum, formatTimeOnly } from '../utils/format';

import { SessionDetailsStyles } from '../styles/SessionDetailsStyle';

import DriveSessionMap from '../components/DriveSessionMap';

type SessionDetailsRouteProp = RouteProp<RootStackParamList, 'SessionDetails'>;

export default function SessionDetailsScreen() {
    const route = useRoute<SessionDetailsRouteProp>();
    const { session } = route.params;

    return (
        <ScrollView contentContainerStyle={SessionDetailsStyles.content}>
            <View style={SessionDetailsStyles.headerCard}>
                <Text style={SessionDetailsStyles.pageLabel}>Session Details</Text>
                <Text style={SessionDetailsStyles.title}>{session.title}</Text>

                <View style={SessionDetailsStyles.headerMetaRow}>
                    <View style={SessionDetailsStyles.headerMetaChip}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={SessionDetailsStyles.headerMetaText}>{formatDateNum(session.date)}</Text>
                    </View>

                    <View style={SessionDetailsStyles.headerMetaChip}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={SessionDetailsStyles.headerMetaText}>{formatDuration(session.durationMs)}</Text>
                    </View>
                </View>
            </View>

            <View style={SessionDetailsStyles.statsRow}>
                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Distance</Text>
                    <Text style={SessionDetailsStyles.statValue}>{formatDistance(session.distanceMeters)}</Text>
                </View>

                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Avg Speed</Text>
                    <Text style={SessionDetailsStyles.statValue}>{session.averageSpeedKmh.toFixed(1)} km/h</Text>
                </View>

                <View style={SessionDetailsStyles.statCard}>
                    <Text style={SessionDetailsStyles.statLabel}>Altitude Gained</Text>
                    <Text style={SessionDetailsStyles.statValue}>{(session.altitudeGainMeters ?? 0).toFixed(1)} m</Text>
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
                        {formatDateNum(session.startTime)} • {formatTimeOnly(session.startTime)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>End Time</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDateNum(session.endTime)} • {formatTimeOnly(session.endTime)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Duration</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {formatDuration(session.durationMs)}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Distance</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.distanceMeters.toFixed(0)} m ({(session.distanceMeters / 1000).toFixed(2)} km)
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Average Speed</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.averageSpeedKmh.toFixed(1)} km/h
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Max Speed</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.maxSpeedKmh ?? 0).toFixed(1)} km/h
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Route Points</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.route.length}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Altitude Gained</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.altitudeGainMeters ?? 0).toFixed(1)} m
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Max Altitude</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {(session.maxAltitudeMeters ?? 0).toFixed(1)} m
                    </Text>
                </View>

                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Car Type</Text>
                    <Text style={SessionDetailsStyles.detailValue}>
                        {session.carType?.trim() ? session.carType : '--'}
                    </Text>
                </View>

                {/* ✅ NOTES SECTION */}
                <View style={SessionDetailsStyles.detailRow}>
                    <Text style={SessionDetailsStyles.detailLabel}>Notes</Text>
                </View>

                <Text style={SessionDetailsStyles.detailValue}>
                    {session.notes?.trim() ? session.notes : 'No notes'}
                </Text>
            </View>

            <View style={SessionDetailsStyles.detailsCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Locations</Text>

                <View style={SessionDetailsStyles.locationBlock}>
                    <View style={SessionDetailsStyles.locationHeader}>
                        <Ionicons name="play-circle" size={18} color="green" />
                        <Text style={SessionDetailsStyles.locationTitle}>Start Location</Text>
                    </View>

                    <Text style={SessionDetailsStyles.locationText}>
                        {session.startLocationLabel?.trim()
                            ? session.startLocationLabel
                            : session.startLocation
                                ? `${session.startLocation.latitude.toFixed(6)}, ${session.startLocation.longitude.toFixed(6)}`
                                : '--'}
                    </Text>
                </View>

                <View style={SessionDetailsStyles.locationBlock}>
                    <View style={SessionDetailsStyles.locationHeader}>
                        <Ionicons name="stop-circle" size={18} color="red" />
                        <Text style={SessionDetailsStyles.locationTitle}>End Location</Text>
                    </View>

                    <Text style={SessionDetailsStyles.locationText}>
                        {session.endLocationLabel?.trim()
                            ? session.endLocationLabel
                            : session.endLocation
                                ? `${session.endLocation.latitude.toFixed(6)}, ${session.endLocation.longitude.toFixed(6)}`
                                : '--'}
                    </Text>
                </View>
            </View>

            <View style={SessionDetailsStyles.mapCard}>
                <Text style={SessionDetailsStyles.sectionTitle}>Saved Route</Text>

                <DriveSessionMap
                    title=""
                    locStart={session.startLocation}
                    locEnd={session.endLocation}
                    route={session.route}
                    mapStyle={{ height: 260 }}
                    wrapperStyle={SessionDetailsStyles.mapWrapperOverride}
                    previewOnly={true}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});