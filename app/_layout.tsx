import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="booking" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="history" />
          <Stack.Screen name="ride" />
          {/* <Stack.Screen name="rideInfo" options={{presentation:'formSheet', sheetAllowedDetents:[0.8,0.9], sheetGrabberVisible:true,}}/> */}
     
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}
