import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCATION_TASK_NAME = 'drive-logger-location-task';
const ACTIVE_SESSION_KEY = 'active_drive_session';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log('Background task error:', error);
        return;
    }

    const event = data as { locations?: Location.LocationObject[] } | undefined;
    const locations = event?.locations ?? [];

    if (!locations.length) return;

    try {
        const raw = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
        if (!raw) return;

        const session = JSON.parse(raw);
        const latest = locations[locations.length - 1];

        const point = {
            latitude: latest.coords.latitude,
            longitude: latest.coords.longitude,
            altitude: latest.coords.altitude ?? null,
            speedKmh: latest.coords.speed != null ? latest.coords.speed * 3.6 : 0,
            timestamp: latest.timestamp,
        };

        session.route = [...(session.route ?? []), point];
        session.currentSpeedKmh = point.speedKmh;
        session.altitudeMeters = point.altitude;
        session.elapsedMs = point.timestamp - session.startTime;

        await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
        console.log('Failed to update active session in background:', e);
    }
});