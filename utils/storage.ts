

export const storage = new MMKV();

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
  storage.delete(StorageKeys.RIDE_HISTORY);
};