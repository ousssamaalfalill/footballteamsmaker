import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { usePlayerContext } from '@/contexts/PlayerContext';
import PlayerListItem from '@/components/PlayerListItem';
import { Plus } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import Colors from '@/constants/Colors';
import EmptyState from '@/components/EmptyState';

SplashScreen.preventAutoHideAsync();

export default function PlayersScreen() {
  const { players, isLoading } = usePlayerContext();
  const colorScheme = useColorScheme() ?? 'light';
  const [activeTab, setActiveTab] = useState('active');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  
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
    filterPlayers(activeTab);
  }, [players, activeTab]);

  const filterPlayers = (tab) => {
    if (tab === 'active') {
      setFilteredPlayers(players.filter(player => player.isActive && player.yellowCards < 3));
    } else if (tab === 'inactive') {
      setFilteredPlayers(players.filter(player => !player.isActive && player.yellowCards < 3));
    } else if (tab === 'blacklisted') {
      setFilteredPlayers(players.filter(player => player.yellowCards >= 3));
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Players',
        headerRight: () => (
          <Pressable 
            onPress={() => router.push('/player-form')}
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}>
            <Plus size={24} color={Colors[colorScheme].headerTint} />
          </Pressable>
        )
      }} />
      
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'active' && [styles.activeTab, { borderBottomColor: Colors.shared.tint }]
          ]}
          onPress={() => setActiveTab('active')}>
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'active' && [styles.activeTabText, { color: Colors.shared.tint }],
              { color: activeTab !== 'active' ? Colors[colorScheme].textDim : undefined }
            ]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'inactive' && [styles.activeTab, { borderBottomColor: Colors.shared.tint }]
          ]}
          onPress={() => setActiveTab('inactive')}>
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'inactive' && [styles.activeTabText, { color: Colors.shared.tint }],
              { color: activeTab !== 'inactive' ? Colors[colorScheme].textDim : undefined }
            ]}>
            Inactive
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'blacklisted' && [styles.activeTab, { borderBottomColor: Colors.shared.tint }]
          ]}
          onPress={() => setActiveTab('blacklisted')}>
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'blacklisted' && [styles.activeTabText, { color: Colors.shared.tint }],
              { color: activeTab !== 'blacklisted' ? Colors[colorScheme].textDim : undefined }
            ]}>
            Blacklisted
          </Text>
        </Pressable>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.shared.tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme].textDim }]}>
            Loading players...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <PlayerListItem player={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title={`No ${activeTab} players`}
              message={activeTab === 'active' 
                ? "Add players and set them as active to see them here." 
                : activeTab === 'inactive' 
                  ? "Players that are marked as inactive will appear here."
                  : "Players with 3 or more yellow cards will appear here."}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    marginRight: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  activeTabText: {
    fontFamily: 'Inter-Bold',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});