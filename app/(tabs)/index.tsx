import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TeamCard from '@/components/TeamCard';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { generateTeams } from '@/utils/teamBalancer';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { RefreshCw, Trophy } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function TeamGeneratorScreen() {
  const { players } = usePlayerContext();
  const [teams, setTeams] = useState<Array<Array<any>>>([]);
  const [numberOfTeams, setNumberOfTeams] = useState('2');
  const colorScheme = useColorScheme() ?? 'light';
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Calculate max teams based on active players
  const maxTeams = Math.min(
    6, // Absolute maximum
    Math.floor(players.filter(p => p.isActive && p.yellowCards < 3).length / 2) // At least 2 players per team
  ) || 2; // Fallback to 2 if no players are available

  // Handle number input change
  const handleNumberChange = (value: string) => {
    const num = parseInt(value) || 2;
    if (num >= 2 && num <= maxTeams) {
      setNumberOfTeams(value);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleGenerateTeams = () => {
    const activePlayers = players.filter(player => player.isActive && player.yellowCards < 3);
    const numTeams = parseInt(numberOfTeams);
    
    if (activePlayers.length === 0) {
      Alert.alert('No Players', 'There are no active players to generate teams.');
      return;
    }
    
    if (activePlayers.length < numTeams) {
      Alert.alert('Not Enough Players', `You need at least ${numTeams} active players to create ${numTeams} teams.`);
      return;
    }
    
    const generatedTeams = generateTeams(activePlayers, numTeams);
    setTeams(generatedTeams);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg' }}
          style={styles.headerImage}
        />
        
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Trophy size={32} color={Colors.shared.tint} />
            <Text style={[styles.heading, { color: Colors[colorScheme].text }]}>
              Friday Football
            </Text>
          </View>
          <Text style={[styles.subheading, { color: Colors[colorScheme].textDim }]}>
            Create balanced teams based on player skills
          </Text>
        </View>
        
        <View style={[styles.controls, { backgroundColor: Colors[colorScheme].cardBackground }]}>
          <View style={styles.teamsControl}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              Number of Teams
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: Colors[colorScheme].border
                }
              ]}
              value={numberOfTeams}
              onChangeText={handleNumberChange}
              keyboardType="number-pad"
              placeholder="Enter number of teams (2-6)"
              placeholderTextColor={Colors[colorScheme].textDim}
            />
            <Text style={[styles.maxTeams, { color: Colors[colorScheme].textDim }]}>
              Maximum possible teams: {maxTeams}
            </Text>
          </View>
          
          <Pressable 
            style={({pressed}) => [
              styles.generateButton,
              { backgroundColor: pressed ? Colors.shared.tintDark : Colors.shared.tint }
            ]}
            onPress={handleGenerateTeams}>
            <Text style={styles.generateButtonText}>Generate Teams</Text>
          </Pressable>
          
          {teams.length > 0 && (
            <Pressable 
              style={({pressed}) => [
                styles.regenerateButton,
                { backgroundColor: pressed ? Colors[colorScheme].backgroundPress : Colors[colorScheme].background }
              ]}
              onPress={handleGenerateTeams}>
              <RefreshCw size={16} color={Colors[colorScheme].tint} />
              <Text style={[styles.regenerateButtonText, { color: Colors[colorScheme].tint }]}>
                Regenerate Teams
              </Text>
            </Pressable>
          )}
        </View>
        
        {teams.length > 0 && (
          <View style={styles.teamsContainer}>
            {teams.map((team, index) => (
              <TeamCard key={index} team={team} teamNumber={index + 1} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  subheading: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  controls: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamsControl: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  maxTeams: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  generateButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  regenerateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  regenerateButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  teamsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});