import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileStyles } from '../styles/ProfileStyle';

export default function ProfileScreen() {
    return (
        <SafeAreaView style={ProfileStyles.container}>
            <Text>Profile</Text>
        </SafeAreaView>
    );
}