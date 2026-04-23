import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DriveSessionProvider } from '@/context/DriveSessionContext';

import NavigationBar from '@/navigation/NavBar';
import SessionsLogsScreen from '@/screens/SessionLogsScreen';
import SessionDetailsScreen from '@/screens/SessionDetailsScreen';
import SavedSessionsScreen from '@/screens/SavedSessionsScreen';
import ManageVehiclesScreen from '@/screens/ManageVehiclesScreen';

import type { DriveSession } from '@/types/DriveSession';

export type RootStackParamList = {
    Back: undefined;
    SessionDetails: { session: DriveSession };
    SessionLogs: undefined;
    SavedSessions: undefined;
    SavedVehicles: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <DriveSessionProvider>

            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Back" component={NavigationBar} options={{ headerShown: false }} />
                    <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: 'Session Details' }} />
                    <Stack.Screen name="SessionLogs" component={SessionsLogsScreen} options={{ title: 'Sessions' }} />
                    <Stack.Screen name="SavedSessions" component={SavedSessionsScreen} options={{ title: 'Saves' }} />
                    <Stack.Screen name="SavedVehicles" component={ManageVehiclesScreen} options={{ title: 'Vehicles' }} />
                </Stack.Navigator>
            </NavigationContainer>

        </DriveSessionProvider>

    );
}