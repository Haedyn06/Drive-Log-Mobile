import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

import { useEffect } from 'react';
import { initDB } from '@/database/db';

export default function App() {
  useEffect(() => {
    initDB();
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}