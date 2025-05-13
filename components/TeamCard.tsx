import { StyleSheet, Text, View, useColorScheme, Image } from 'react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Trophy, Star } from 'lucide-react-native';

export default function TeamCard({ team, teamNumber }) {
  const colorScheme = useColorScheme() ?? 'light';
  const totalLevel = team.reduce((sum, player) => sum + player.level, 0);
  
  return (
    <Animated.View 
      entering={FadeIn.delay(teamNumber * 100).duration(300)}
      style={[styles.card, { backgroundColor: Colors[colorScheme].cardBackground }]}>
      <View style={[styles.header, { backgroundColor: Colors.shared.tint }]}>
        <View style={styles.headerContent}>
          <Trophy size={24} color="white" />
          <Text style={styles.headerText}>Team {teamNumber}</Text>
        </View>
        <Text style={styles.levelText}>Team Power: {totalLevel}</Text>
      </View>
      
      <View style={styles.fieldBackground}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg' }}
          style={styles.fieldImage}
        />
        <View style={styles.playerList}>
          {team.map((player, index) => (
            <View 
              key={player.id} 
              style={[
                styles.playerRow,
                index < team.length - 1 && styles.playerRowBorder
              ]}>
              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, { color: Colors[colorScheme].text }]}>
                  {player.firstName} {player.lastName}
                </Text>
                <View style={styles.playerStars}>
                  {[...Array(player.level)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      color="#FFD700"
                      fill="#FFD700"
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    padding: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  levelText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    opacity: 0.9,
  },
  fieldBackground: {
    position: 'relative',
  },
  fieldImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  playerList: {
    padding: 12,
  },
  playerRow: {
    paddingVertical: 8,
  },
  playerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  playerInfo: {
    gap: 4,
  },
  playerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  playerStars: {
    flexDirection: 'row',
    gap: 2,
  },
});