import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import HomeScreen from '@/screens/HomeScreen';
import NewSessionScreen from '@/screens/NewSessionScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName: string, focused: boolean) => {
    const icons: Record<string, { active: any; inactive: any }> = {
        Home: { active: 'home', inactive: 'home-outline' },
        NewSession: { active: 'car', inactive: 'car-outline' },
        Profile: { active: 'person', inactive: 'person-outline' },
    };

    return focused ? icons[routeName].active : icons[routeName].inactive;
};

const tabs = [
    {
        name: 'Home',
        component: HomeScreen,
        haptic: Haptics.ImpactFeedbackStyle.Medium,
        title: 'Home',
    },
    {
        name: 'NewSession',
        component: NewSessionScreen,
        haptic: Haptics.ImpactFeedbackStyle.Medium,
        title: 'Start Your Drive',
    },
    {
        name: 'Profile',
        component: ProfileScreen,
        haptic: Haptics.ImpactFeedbackStyle.Medium,
        title: 'Profile',
    },
];

const withHaptics = (style: Haptics.ImpactFeedbackStyle) => ({
    tabPress: async () => {
        await Haptics.impactAsync(style);
    },
});

export default function NavigationBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#000', tabBarInactiveTintColor: '#888',
                tabBarIcon: ({ color, size, focused }) =>
                    <Ionicons name={getTabIcon(route.name, focused)} size={size} color={color} />
            })} >
                
            {tabs.map((tab) => 
                <Tab.Screen key={tab.name} name={tab.name} component={tab.component} listeners={withHaptics(tab.haptic)} 
                    options={{ headerShown: true, headerTitle: tab.title }} />
            )}
        </Tab.Navigator>
    );
}