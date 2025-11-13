import { Stack } from 'expo-router';
import React, { useState } from 'react';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="booking" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="ride" />
      <Stack.Screen name="history" />
    </Stack>
  );
}