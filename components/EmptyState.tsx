import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Users } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function EmptyState({ title, message }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].backgroundPress }]}>
        <Users size={32} color={Colors.shared.tint} />
      </View>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{title}</Text>
      <Text style={[styles.message, { color: Colors[colorScheme].textDim }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});