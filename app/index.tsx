import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Redirect to tabs home
  return <Redirect href="/(tabs)" />;
}