import { Platform } from 'react-native';

const STORAGE_KEY = 'friday_football_players';

const getWebPlayers = () => {
  try {
    const players = localStorage.getItem(STORAGE_KEY);
    return players ? JSON.parse(players) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveWebPlayers = (players: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

let db: any = null;

export const initDB = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, '[]');
    }
    return Promise.resolve();
  }

  if (!db) {
    const SQLite = await import('expo-sqlite');
    db = SQLite.openDatabase('friday_football.db');
  }

  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx: any) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            level INTEGER NOT NULL,
            isActive INTEGER NOT NULL DEFAULT 1,
            yellowCards INTEGER NOT NULL DEFAULT 0
          )`,
          [],
          () => resolve(),
          (_, error: any) => {
            reject(error);
            return false;
          }
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllPlayers = async (): Promise<any[]> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    return getWebPlayers();
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM players ORDER BY firstName, lastName',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addPlayer = async (player: any): Promise<number> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const newPlayer = {
      ...player,
      id: Date.now(),
      yellowCards: 0
    };
    players.push(newPlayer);
    saveWebPlayers(players);
    return newPlayer.id;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO players (firstName, lastName, level, isActive) VALUES (?, ?, ?, ?)',
        [player.firstName, player.lastName, player.level, player.isActive],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updatePlayer = async (player: any): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const index = players.findIndex(p => p.id === player.id);
    if (index !== -1) {
      players[index] = { ...players[index], ...player };
      saveWebPlayers(players);
      return;
    }
    throw new Error('Player not found');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE players SET firstName = ?, lastName = ?, level = ?, isActive = ? WHERE id = ?',
        [player.firstName, player.lastName, player.level, player.isActive, player.id],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deletePlayer = async (id: number): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const filteredPlayers = players.filter(p => p.id !== id);
    saveWebPlayers(filteredPlayers);
    return;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM players WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const toggleActive = async (id: number, isActive: number): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      players[index].isActive = isActive;
      saveWebPlayers(players);
      return;
    }
    throw new Error('Player not found');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE players SET isActive = ? WHERE id = ?',
        [isActive, id],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const incrementYellowCard = async (id: number): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      const newYellowCards = (players[index].yellowCards || 0) + 1;
      players[index].yellowCards = newYellowCards;
      players[index].isActive = newYellowCards >= 3 ? 0 : players[index].isActive;
      saveWebPlayers(players);
      return;
    }
    throw new Error('Player not found');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE players SET yellowCards = yellowCards + 1, isActive = CASE WHEN yellowCards >= 2 THEN 0 ELSE isActive END WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const resetYellowCards = async (): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    players.forEach(player => {
      player.yellowCards = 0;
      player.isActive = 1;
    });
    saveWebPlayers(players);
    return;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE players SET yellowCards = 0, isActive = 1',
        [],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const resetPlayerYellowCards = async (id: number): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    const players = getWebPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
      players[index].yellowCards = 0;
      players[index].isActive = 1;
      saveWebPlayers(players);
      return;
    }
    throw new Error('Player not found');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE players SET yellowCards = 0, isActive = 1 WHERE id = ?',
        [id],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const resetDatabase = async (): Promise<void> => {
  await initDB();
  
  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, '[]');
    return;
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM players',
        [],
        () => {
          resolve();
        },
        (_, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const exportData = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    throw new Error('Export is not supported on web');
  }

  const FileSystem = await import('expo-file-system');
  const Sharing = await import('expo-sharing');

  try {
    const players = await getAllPlayers();
    const data = JSON.stringify(players, null, 2);
    const fileUri = `${FileSystem.documentDirectory}friday_football_export.json`;
    
    await FileSystem.writeAsStringAsync(fileUri, data);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

export const importData = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    throw new Error('Import is not supported on web');
  }

  const DocumentPicker = await import('expo-document-picker');
  const FileSystem = await import('expo-file-system');

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if (result.canceled) {
      throw new Error('Import canceled');
    }

    const fileUri = result.assets[0].uri;
    const data = await FileSystem.readAsStringAsync(fileUri);
    const players = JSON.parse(data);

    await resetDatabase();
    
    for (const player of players) {
      const { id, ...playerData } = player;
      await addPlayer(playerData);
    }
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};