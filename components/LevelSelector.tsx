import { StyleSheet, View, Pressable, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function LevelSelector({ level, onLevelChange }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Create an array of 10 values for the level buttons
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  
  return (
    <View style={styles.container}>
      {levels.map((value) => (
        <Pressable
          key={value}
          style={[
            styles.levelButton,
            level === value && styles.selectedLevel,
            { 
              backgroundColor: level === value 
                ? Colors.shared.tint 
                : Colors[colorScheme].backgroundPress
            }
          ]}
          onPress={() => onLevelChange(value)}>
          <View 
            style={[
              styles.levelDot,
              { 
                backgroundColor: level === value 
                  ? 'white' 
                  : getLevelColor(value)
              }
            ]} 
          />
        </Pressable>
      ))}
    </View>
  );
}

// Function to get color based on level
function getLevelColor(level) {
  if (level <= 3) {
    return '#FFA000'; // Beginner - amber
  } else if (level <= 7) {
    return '#1E88E5'; // Intermediate - blue
  } else {
    return '#43A047'; // Advanced - green
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  levelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLevel: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});