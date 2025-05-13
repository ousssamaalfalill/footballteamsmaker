import { StyleSheet, Text, View, Pressable, Alert, useColorScheme, Image } from 'react-native';
import { router } from 'expo-router';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { CircleAlert as AlertCircle, CreditCard as Edit, Trash2, Star, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeInRight, FadeOutLeft, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState } from 'react';

export default function PlayerListItem({ player }) {
  const { toggleActive, incrementYellowCard, deletePlayer, resetPlayerYellowCards } = usePlayerContext();
  const colorScheme = useColorScheme() ?? 'light';
  const [isSwipedOpen, setIsSwipedOpen] = useState(false);
  
  const translateX = useSharedValue(0);
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(0, Math.max(-200, event.translationX));
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withTiming(-200);
        setIsSwipedOpen(true);
      } else {
        translateX.value = withTiming(0);
        setIsSwipedOpen(false);
      }
    });
    
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));
  
  const handleClose = () => {
    translateX.value = withTiming(0);
    setIsSwipedOpen(false);
  };
  
  const handleToggleActive = () => {
    toggleActive(player.id, player.isActive === 0 ? 1 : 0);
    handleClose();
  };
  
  const handleYellowCard = () => {
    const newYellowCards = player.yellowCards + 1;
    const message = newYellowCards >= 3 
      ? 'This player now has 3 yellow cards and will be blacklisted.'
      : `Yellow card added. Total: ${newYellowCards}`;
      
    Alert.alert('Yellow Card', message, [{ text: 'OK' }]);
    incrementYellowCard(player.id);
    handleClose();
  };

  const handleUnblacklist = () => {
    Alert.alert(
      'Unblacklist Player',
      `Are you sure you want to remove ${player.firstName} ${player.lastName} from the blacklist?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: handleClose },
        { 
          text: 'Unblacklist', 
          onPress: () => {
            resetPlayerYellowCards(player.id);
            handleClose();
          }
        },
      ]
    );
  };
  
  const handleEdit = () => {
    router.push({
      pathname: '/player-form',
      params: { id: player.id }
    });
    handleClose();
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.firstName} ${player.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: handleClose },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deletePlayer(player.id);
            handleClose();
          }
        },
      ]
    );
  };
  
  const isBlacklisted = player.yellowCards >= 3;
  
  const getLevelStars = () => {
    const stars = [];
    for (let i = 0; i < player.level; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color="#FFD700"
          fill="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInRight}
        exiting={FadeOutLeft}
        style={[styles.actionsContainer, { right: 0 }]}>
        <Pressable 
          style={[styles.actionButton, styles.editButton]} 
          onPress={handleEdit}>
          <Edit size={20} color="#fff" />
        </Pressable>
        <Pressable 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}>
          <Trash2 size={20} color="#fff" />
        </Pressable>
      </Animated.View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View 
          style={[
            styles.playerCard, 
            animatedStyle,
            { 
              backgroundColor: Colors[colorScheme].cardBackground,
              borderLeftColor: isBlacklisted 
                ? Colors.shared.warning 
                : player.isActive ? Colors.shared.success : Colors.shared.error
            }
          ]}>
          <View style={styles.playerInfo}>
            <View style={styles.nameContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg' }}
                style={styles.playerIcon}
              />
              <View>
                <Text style={[styles.playerName, { color: Colors[colorScheme].text }]}>
                  {player.firstName} {player.lastName}
                </Text>
                <View style={styles.levelStars}>
                  {getLevelStars()}
                </View>
              </View>
            </View>
            <View style={styles.playerMeta}>
              {player.yellowCards > 0 && (
                <View style={styles.yellowCardContainer}>
                  <AlertCircle size={14} color={Colors.shared.warning} />
                  <Text style={styles.yellowCardText}>{player.yellowCards}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.controlsContainer}>
            {isBlacklisted ? (
              <Pressable
                style={[styles.unblacklistButton]}
                onPress={handleUnblacklist}>
                <RefreshCw size={16} color={Colors.shared.warning} />
                <Text style={styles.unblacklistButtonText}>Unblacklist</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  style={[
                    styles.toggleButton,
                    player.isActive ? styles.activeButton : styles.inactiveButton
                  ]}
                  onPress={handleToggleActive}>
                  <Text style={styles.toggleButtonText}>
                    {player.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </Pressable>
                
                <Pressable
                  style={styles.yellowCardButton}
                  onPress={handleYellowCard}>
                  <AlertCircle size={16} color={Colors.shared.warning} />
                </Pressable>
              </>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 8,
  },
  playerCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  levelStars: {
    flexDirection: 'row',
    gap: 2,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  yellowCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 124, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yellowCardText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.shared.warning,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  activeButton: {
    backgroundColor: Colors.shared.success,
  },
  inactiveButton: {
    backgroundColor: Colors.shared.error,
  },
  yellowCardButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 124, 0, 0.1)',
  },
  unblacklistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 124, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  unblacklistButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.shared.warning,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.shared.tint,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  deleteButton: {
    backgroundColor: Colors.shared.error,
  },
});