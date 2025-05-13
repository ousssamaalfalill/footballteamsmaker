import { createContext, useContext, useState, useEffect } from 'react';
import * as PlayerService from '@/services/PlayerService';

type Player = {
  id: number;
  firstName: string;
  lastName: string;
  level: number;
  isActive: number;
  yellowCards: number;
};

type PlayerContextType = {
  players: Player[];
  isLoading: boolean;
  addPlayer: (player: Omit<Player, 'id' | 'yellowCards'>) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (id: number) => Promise<void>;
  toggleActive: (id: number, isActive: number) => Promise<void>;
  incrementYellowCard: (id: number) => Promise<void>;
  resetYellowCards: () => Promise<void>;
  resetPlayerYellowCards: (id: number) => Promise<void>;
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
  resetDatabase: () => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await PlayerService.initDB();
        const loadedPlayers = await PlayerService.getAllPlayers();
        setPlayers(loadedPlayers);
      } catch (error) {
        console.error('Failed to initialize and load players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const loadedPlayers = await PlayerService.getAllPlayers();
      setPlayers(loadedPlayers);
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPlayer = async (player) => {
    try {
      setIsLoading(true);
      const id = await PlayerService.addPlayer(player);
      await loadPlayers();
      return id;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayer = async (player) => {
    try {
      setIsLoading(true);
      await PlayerService.updatePlayer(player);
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlayer = async (id) => {
    try {
      setIsLoading(true);
      await PlayerService.deletePlayer(id);
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      setIsLoading(true);
      await PlayerService.toggleActive(id, isActive);
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const incrementYellowCard = async (id) => {
    try {
      setIsLoading(true);
      await PlayerService.incrementYellowCard(id);
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const resetYellowCards = async () => {
    try {
      setIsLoading(true);
      await PlayerService.resetYellowCards();
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlayerYellowCards = async (id) => {
    try {
      setIsLoading(true);
      await PlayerService.resetPlayerYellowCards(id);
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsLoading(true);
      return await PlayerService.exportData();
    } finally {
      setIsLoading(false);
    }
  };

  const importData = async () => {
    try {
      setIsLoading(true);
      await PlayerService.importData();
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  const resetDatabase = async () => {
    try {
      setIsLoading(true);
      await PlayerService.resetDatabase();
      await loadPlayers();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        players,
        isLoading,
        addPlayer,
        updatePlayer,
        deletePlayer,
        toggleActive,
        incrementYellowCard,
        resetYellowCards,
        resetPlayerYellowCards,
        exportData,
        importData,
        resetDatabase,
      }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}