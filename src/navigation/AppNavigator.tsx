import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NavigationBar from './NavBar';
import SessionDetailsScreen from '../screens/SessionDetailsScreen';
import type { DriveSession } from '../types/DriveSession';

    export type RootStackParamList = {
        MainTabs: undefined;
        SessionDetails: { session: DriveSession };
    };

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={NavigationBar} options={{ headerShown: false }} />
                <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: 'Session Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}