import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginStyles } from '../styles/LoginStyle';

export default function LoginScreen() {
    return (
        <SafeAreaView style={LoginStyles.container}>
            <Text>Login</Text>
        </SafeAreaView>
    );
}