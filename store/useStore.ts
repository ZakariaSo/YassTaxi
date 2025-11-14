import { create } from 'zustand';
import { Location } from '../utils/locations';

export interface Ride {
  id: string;
  departure: Location;
  destination: Location;
  distance: number;
  price: number;
  duration: number;
  startTime: Date;
  isNight: boolean;
}

interface StoreState {
  // Mode jour/nuit
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
  toggleNightMode: () => void;

  // Course en cours
  currentRide: Ride | null;
  setCurrentRide: (ride: Ride | null) => void;
  startRide: (ride: Ride) => void;
  endRide: () => void;

  // Historique
  rideHistory: Ride[];
  addToHistory: (ride: Ride) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Stats
  getTotalSpent: () => number;
  getTotalRides: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  // État initial
  isNightMode: false,
  currentRide: null,
  rideHistory: [],

  // Actions mode jour/nuit
  setIsNightMode: (value) => set({ isNightMode: value }),
  toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),

  // Actions course
  setCurrentRide: (ride) => set({ currentRide: ride }),
  startRide: (ride) => {
    console.log('🚀 Démarrage de la course:', ride);
    set({ currentRide: ride });
  },
  
  endRide: () => {
    const { currentRide, addToHistory } = get();
    console.log('🏁 Fin de course:', currentRide);
    
    if (currentRide) {
      addToHistory(currentRide);
      console.log('✅ Course ajoutée à l\'historique');
    } else {
      console.warn('⚠️ Aucune course en cours à terminer');
    }
    
    set({ currentRide: null });
  },

  // Actions historique
  addToHistory: (ride) => {
    console.log('📝 Ajout à l\'historique:', ride);
    set((state) => {
      const newHistory = [ride, ...state.rideHistory];
      console.log('📚 Nouvel historique:', newHistory.length, 'courses');
      return { rideHistory: newHistory };
    });
  },
  
  removeFromHistory: (id) => {
    console.log('🗑️ Suppression de la course:', id);
    set((state) => ({
      rideHistory: state.rideHistory.filter((ride) => ride.id !== id),
    }));
  },
  
  clearHistory: () => {
    console.log('🧹 Nettoyage de l\'historique');
    set({ rideHistory: [] });
  },

  // Getters stats
  getTotalSpent: () => {
    const total = get().rideHistory.reduce((sum, ride) => sum + ride.price, 0);
    console.log('💰 Total dépensé:', total);
    return total;
  },
  
  getTotalRides: () => {
    const count = get().rideHistory.length;
    console.log('🚕 Nombre de courses:', count);
    return count;
  },
}));