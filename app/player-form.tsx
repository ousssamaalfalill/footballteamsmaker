import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import Colors from '@/constants/Colors';
import { ArrowLeft } from 'lucide-react-native';
import LevelSelector from '@/components/LevelSelector';

SplashScreen.preventAutoHideAsync();

export default function PlayerFormScreen() {
  const { id } = useLocalSearchParams();
  const { addPlayer, updatePlayer, players } = usePlayerContext();
  const colorScheme = useColorScheme() ?? 'light';
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [level, setLevel] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (id) {
      const player = players.find(p => p.id === Number(id));
      if (player) {
        setFirstName(player.firstName);
        setLastName(player.lastName);
        setLevel(player.level);
        setIsActive(player.isActive === 1);
        setIsEditing(true);
      }
    }
  }, [id, players]);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter both first and last name.');
      return;
    }
    
    const playerData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      level,
      isActive: isActive ? 1 : 0,
    };
    
    if (isEditing && id) {
      updatePlayer({ ...playerData, id: Number(id) });
      Alert.alert('Success', 'Player updated successfully');
    } else {
      addPlayer(playerData);
      Alert.alert('Success', 'Player added successfully');
    }
    
    router.back();
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{ 
          title: isEditing ? 'Edit Player' : 'Add Player',
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}>
              <ArrowLeft size={24} color={Colors[colorScheme].headerTint} />
            </Pressable>
          )
        }} 
      />
      
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>First Name</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border
            }
          ]}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          placeholderTextColor={Colors[colorScheme].textDim}
        />
        
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Last Name</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border
            }
          ]}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          placeholderTextColor={Colors[colorScheme].textDim}
        />
        
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Player Level: {level}</Text>
        <View style={styles.levelContainer}>
          <LevelSelector level={level} onLevelChange={setLevel} />
        </View>
        
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Status</Text>
        <View style={styles.statusContainer}>
          <Pressable
            style={[
              styles.statusButton,
              isActive && styles.activeButton,
              { borderColor: Colors[colorScheme].border }
            ]}
            onPress={() => setIsActive(true)}>
            <Text 
              style={[
                styles.statusButtonText,
                isActive && styles.activeButtonText
              ]}>
              Active
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.statusButton,
              !isActive && styles.inactiveButton,
              { borderColor: Colors[colorScheme].border }
            ]}
            onPress={() => setIsActive(false)}>
            <Text 
              style={[
                styles.statusButtonText,
                !isActive && styles.inactiveButtonText
              ]}>
              Inactive
            </Text>
          </Pressable>
        </View>
        
        <Pressable 
          style={({pressed}) => [
            styles.saveButton,
            { backgroundColor: pressed ? Colors.shared.tintDark : Colors.shared.tint }
          ]}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Player' : 'Add Player'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 8,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  levelContainer: {
    marginVertical: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#757575',
  },
  activeButton: {
    backgroundColor: '#E8F5E9',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0,
  },
  activeButtonText: {
    color: '#1E5631',
  },
  inactiveButton: {
    backgroundColor: '#FFEBEE',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0,
  },
  inactiveButtonText: {
    color: '#B71C1C',
  },
  saveButton: {
    backgroundColor: '#1E5631',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});