import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CASABLANCA_CENTER } from '../constants/tarifs';
import { useStore } from '../store/useStore';
import { generateTaxis } from '../utils/locations';

export default function MapScreen() {
  const router = useRouter();
  const { isNightMode, toggleNightMode } = useStore();
  const [taxis, setTaxis] = useState(generateTaxis(7));

  // Animer les taxis toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setTaxis((prevTaxis) =>
        prevTaxis.map((taxi) => ({
          ...taxi,
          latitude: taxi.latitude + (Math.random() - 0.5) * 0.002,
          longitude: taxi.longitude + (Math.random() - 0.5) * 0.002,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleReserve = () => {
    router.push('/booking');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={CASABLANCA_CENTER}
        customMapStyle={isNightMode ? nightMapStyle : []}
      >
        {/* Position utilisateur */}
        <Marker
          coordinate={{
            latitude: CASABLANCA_CENTER.latitude,
            longitude: CASABLANCA_CENTER.longitude,
          }}
          title="Votre position"
        >
          <View style={styles.userMarker}>
            <View style={styles.userDot} />
          </View>
        </Marker>

        {/* Taxis disponibles */}
        {taxis.map((taxi) => (
          <Marker
            key={taxi.id}
            coordinate={{
              latitude: taxi.latitude,
              longitude: taxi.longitude,
            }}
             image={require("../assets/taxi1.png")}
          >
       
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚕 YassTaxi</Text>
        <TouchableOpacity
          style={styles.modeToggle}
          onPress={toggleNightMode}
        >
          <Text style={styles.modeIcon}>{isNightMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Carte d'information */}
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Taxis disponibles</Text>
        <Text style={styles.cardSubtitle}>
          {taxis.length} petits taxis rouges autour de vous
        </Text>
        <View style={styles.tarifBadge}>
          <Text style={styles.tarifText}>
            {isNightMode ? '🌙 Tarif Nuit: 2.00 DH/km' : '☀️ Tarif Jour: 1.50 DH/km'}
          </Text>
        </View>
        <TouchableOpacity style={styles.reserveBtn} onPress={handleReserve}>
          <Text style={styles.reserveBtnText}>Réserver un Taxi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const nightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeToggle: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeIcon: {
    fontSize: 24,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  tarifBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tarifText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  reserveBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});