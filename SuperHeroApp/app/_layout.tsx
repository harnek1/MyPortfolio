import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack>
  <Stack.Screen name="index" options={{ title: 'Home', headerTitleAlign: "center" }}/>
  <Stack.Screen name="search" options={{ title: 'Search', headerTitleAlign: "center" }} />
  <Stack.Screen name="details" options={{ title: 'Details', headerTitleAlign: "center" }} />
</Stack>;
   
};