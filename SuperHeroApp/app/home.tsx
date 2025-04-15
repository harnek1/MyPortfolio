import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


export default function Home() {
  const router = useRouter();
  return <View style={styles.container}>
    <Text style={styles.text}>Welcome to the App that will allow you to know facts about your favorite Marvel and DC characters.</Text>
    <Button title="Enter The App" onPress={() => router.push('/search')} />
  </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
  },
});
