
import { createMMKV } from 'react-native-mmkv';
export const storage = createMMKV()

export const StorageKeys = {
  RIDE_HISTORY: 'ride_history',
  USER_PREFERENCES: 'user_preferences',
};

export interface RideHistory {
  id: string;
  departure: string;
  destination: string;
  distance: number;
  price: number;
  duration: number;
  date: string;
  isNight: boolean;
}

export const saveRideHistory = (rides: RideHistory[]) => {
  storage.set(StorageKeys.RIDE_HISTORY, JSON.stringify(rides));
};

export const getRideHistory = (): RideHistory[] => {
  const data = storage.getString(StorageKeys.RIDE_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const addRide = (ride: RideHistory) => {
  const history = getRideHistory();
  history.unshift(ride);
  saveRideHistory(history);
};

export const deleteRide = (id: string) => {
  const history = getRideHistory().filter(ride => ride.id !== id);
  saveRideHistory(history);
};

export const clearHistory = () => {
  storage.remove(StorageKeys.RIDE_HISTORY);
};