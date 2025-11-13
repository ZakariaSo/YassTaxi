/**
 * Calcule la distance entre deux points GPS avec la formule de Haversine
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Calcule le prix d'une course selon le tarif jour/nuit
 */
export const calculatePrice = (
  distance: number,
  isNightMode: boolean
): number => {
  const tarif = isNightMode
    ? { priseEnCharge: 7.50, parKm: 2.00 }
    : { priseEnCharge: 7.50, parKm: 1.50 };
  
  return tarif.priseEnCharge + distance * tarif.parKm;
};

/**
 * Calcule le temps estimé en minutes (vitesse moyenne 30 km/h)
 */
export const calculateDuration = (distance: number): number => {
  return Math.ceil((distance / 30) * 60);
};

/**
 * Vérifie si on est en mode nuit (20h-6h)
 */
export const isNightTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 6;
};