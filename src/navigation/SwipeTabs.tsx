import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '@/screens/HomeScreen';
import NewSessionScreen from '@/screens/NewSessionScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

export default function SwipeTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
            swipeEnabled: true,
            tabBarStyle: { display: 'none' }, // hide top bar
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Session" component={NewSessionScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}