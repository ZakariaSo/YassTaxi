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
  startRide: (ride) => set({ currentRide: ride }),
  endRide: () => {
    const { currentRide, addToHistory } = get();
    if (currentRide) {
      addToHistory(currentRide);
    }
    set({ currentRide: null });
  },

  // Actions historique
  addToHistory: (ride) =>
    set((state) => ({
      rideHistory: [ride, ...state.rideHistory],
    })),
  
  removeFromHistory: (id) =>
    set((state) => ({
      rideHistory: state.rideHistory.filter((ride) => ride.id !== id),
    })),
  
  clearHistory: () => set({ rideHistory: [] }),

  // Getters stats
  getTotalSpent: () => {
    return get().rideHistory.reduce((sum, ride) => sum + ride.price, 0);
  },
  
  getTotalRides: () => {
    return get().rideHistory.length;
  },
}));