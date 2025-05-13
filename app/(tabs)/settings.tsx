import { View, Text, StyleSheet, ScrollView, Pressable, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { Database, RefreshCw, Trash2, Info } from 'lucide-react-native';
import Colors from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function SettingsScreen() {
  const { resetYellowCards, exportData, importData, resetDatabase } = usePlayerContext();
  const colorScheme = useColorScheme() ?? 'light';
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleResetYellowCards = () => {
    Alert.alert(
      'Reset Yellow Cards',
      'Are you sure you want to reset all yellow cards to 0? This will also reactivate blacklisted players.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: () => {
            resetYellowCards();
            Alert.alert('Success', 'All yellow cards have been reset to 0.');
          } 
        },
      ]
    );
  };

  const handleDatabaseReset = () => {
    Alert.alert(
      'Reset Database',
      'This will delete ALL players and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: () => {
            resetDatabase();
            Alert.alert('Success', 'Database has been reset.');
          } 
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      await exportData();
      Alert.alert('Success', 'Data exported successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'Import Data',
      'This will replace all current data with imported data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: async () => {
            try {
              await importData();
              Alert.alert('Success', 'Data imported successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to import data.');
            }
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Team Management</Text>
        
        <Pressable
          style={({pressed}) => [
            styles.setting,
            { backgroundColor: pressed ? Colors[colorScheme].backgroundPress : Colors[colorScheme].background }
          ]}
          onPress={handleResetYellowCards}>
          <View style={styles.settingIcon}>
            <RefreshCw size={24} color={Colors.shared.tint} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: Colors[colorScheme].text }]}>Reset Yellow Cards</Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].textDim }]}>Reset all yellow cards to 0 and reactivate blacklisted players</Text>
          </View>
        </Pressable>
        
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text, marginTop: 24 }]}>Data Management</Text>
        
        <Pressable
          style={({pressed}) => [
            styles.setting,
            { backgroundColor: pressed ? Colors[colorScheme].backgroundPress : Colors[colorScheme].background }
          ]}
          onPress={handleExportData}>
          <View style={styles.settingIcon}>
            <Database size={24} color={Colors.shared.tint} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: Colors[colorScheme].text }]}>Export Data</Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].textDim }]}>Export all player data to a file</Text>
          </View>
        </Pressable>
        
        <Pressable
          style={({pressed}) => [
            styles.setting,
            { backgroundColor: pressed ? Colors[colorScheme].backgroundPress : Colors[colorScheme].background }
          ]}
          onPress={handleImportData}>
          <View style={styles.settingIcon}>
            <Database size={24} color={Colors.shared.tint} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: Colors[colorScheme].text }]}>Import Data</Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].textDim }]}>Import player data from a file</Text>
          </View>
        </Pressable>
        
        <Pressable
          style={({pressed}) => [
            styles.setting,
            { backgroundColor: pressed ? Colors[colorScheme].backgroundPress : Colors[colorScheme].background }
          ]}
          onPress={handleDatabaseReset}>
          <View style={styles.settingIcon}>
            <Trash2 size={24} color="#E53935" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: Colors[colorScheme].text }]}>Reset Database</Text>
            <Text style={[styles.settingDescription, { color: Colors[colorScheme].textDim }]}>Delete all players and data</Text>
          </View>
        </Pressable>
        
        <View style={styles.aboutSection}>
          <Info size={24} color={Colors[colorScheme].textDim} style={styles.aboutIcon} />
          <Text style={[styles.aboutTitle, { color: Colors[colorScheme].text }]}>Friday Football Team Builder</Text>
          <Text style={[styles.aboutVersion, { color: Colors[colorScheme].textDim }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutCopyright, { color: Colors[colorScheme].textDim }]}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingIcon: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  aboutSection: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  aboutIcon: {
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  aboutVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  aboutCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});