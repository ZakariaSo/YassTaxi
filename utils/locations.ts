export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const LOCATIONS: Location[] = [
  { id: 1, name: "Aéroport Mohammed V", latitude: 33.3673, longitude: -7.5898 },
  { id: 2, name: "Gare Casa-Voyageurs", latitude: 33.5922, longitude: -7.6145 },
  { id: 3, name: "Morocco Mall", latitude: 33.5473, longitude: -7.6715 },
  { id: 4, name: "Twin Center", latitude: 33.5885, longitude: -7.6244 },
  { id: 5, name: "Marina de Casablanca", latitude: 33.5883, longitude: -7.6181 },
  { id: 6, name: "Mosquée Hassan II", latitude: 33.6084, longitude: -7.6326 },
  { id: 7, name: "Quartier des Habous", latitude: 33.5771, longitude: -7.6296 },
  { id: 8, name: "Ain Diab", latitude: 33.5698, longitude: -7.6780 },
  { id: 9, name: "Boulevard Zerktouni", latitude: 33.5835, longitude: -7.6233 },
  { id: 10, name: "Marché Central", latitude: 33.5920, longitude: -7.6211 }
];

export const generateTaxis = (count: number = 7) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    latitude: 33.5731 + (Math.random() - 0.5) * 0.04,
    longitude: -7.5898 + (Math.random() - 0.5) * 0.04,
    heading: Math.random() * 360
  }));
};