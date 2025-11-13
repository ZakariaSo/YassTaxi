import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { PriceCounter } from '../components/PriceCounter';
import { useStore } from '../store/useStore';

export default function RideScreen() {
  const router = useRouter();
  const { currentRide, endRide, isNightMode } = useStore();

  const [timer, setTimer] = useState(0);
  const [taxiProgress, setTaxiProgress] = useState(0);
  const [taxiPosition, setTaxiPosition] = useState(
    currentRide
      ? {
          latitude: currentRide.departure.latitude,
          longitude: currentRide.departure.longitude,
        }
      : null
  );

  // Si pas de course, retour
  useEffect(() => {
    if (!currentRide) {
      router.replace('/');
    }
  }, [currentRide]);

  // Timer de la course
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
      setTaxiProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (currentRide?.duration || 10);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRide]);

  // Animation du taxi
  useEffect(() => {
    if (!currentRide) return;

    const interval = setInterval(() => {
      setTaxiPosition((prev) => {
        if (!prev || taxiProgress >= 100) return prev;

        const latDiff =
          currentRide.destination.latitude - currentRide.departure.latitude;
        const lngDiff =
          currentRide.destination.longitude - currentRide.departure.longitude;

        return {
          latitude: currentRide.departure.latitude + (latDiff * taxiProgress) / 100,
          longitude: currentRide.departure.longitude + (lngDiff * taxiProgress) / 100,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [taxiProgress, currentRide]);

  const handleCancel = () => {
    Alert.alert(
      'Annuler la course',
      'Êtes-vous sûr de vouloir annuler cette course ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            endRide();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Course terminée',
      `Merci d'avoir utilisé Petit Taxi Casa !\nPrix final: ${currentRide?.price.toFixed(
        2
      )} DH`,
      [
        {
          text: 'OK',
          onPress: () => {
            endRide();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!currentRide || !taxiPosition) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chargement...</Text>
      </View>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Carte avec trajet */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentRide.departure.latitude,
          longitude: currentRide.departure.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Ligne du trajet */}
        <Polyline
          coordinates={[
            {
              latitude: currentRide.departure.latitude,
              longitude: currentRide.departure.longitude,
            },
            {
              latitude: currentRide.destination.latitude,
              longitude: currentRide.destination.longitude,
            },
          ]}
          strokeColor="#3B82F6"
          strokeWidth={4}
        />

        {/* Marqueur départ */}
        <Marker
          coordinate={{
            latitude: currentRide.departure.latitude,
            longitude: currentRide.departure.longitude,
          }}
          title="Départ"
        >
          <View style={styles.markerDeparture}>
            <Text style={styles.markerText}>📍</Text>
          </View>
        </Marker>

        {/* Marqueur destination */}
        <Marker
          coordinate={{
            latitude: currentRide.destination.latitude,
            longitude: currentRide.destination.longitude,
          }}
          title="Destination"
        >
          <View style={styles.markerDestination}>
            <Text style={styles.markerText}>🎯</Text>
          </View>
        </Marker>

        {/* Taxi en mouvement */}
        <Marker coordinate={taxiPosition}  image={require("../assets/taxi1.png")}>
        
        </Marker>
      </MapView>

      {/* Informations de la course */}
      <View style={styles.rideInfo}>
        {/* Carte chauffeur */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitial}>M</Text>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>Mohamed Alami</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ 4.8</Text>
              <Text style={styles.ratingCount}>(234 courses)</Text>
            </View>
            <Text style={styles.carInfo}>🚗 Petit Taxi Rouge • 4521</Text>
          </View>
        </View>

        {/* Détails du trajet */}
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱️</Text>
            <Text style={styles.detailText}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📏</Text>
            <Text style={styles.detailText}>{currentRide.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>{isNightMode ? '🌙' : '☀️'}</Text>
            <Text style={styles.detailText}>{isNightMode ? 'Nuit' : 'Jour'}</Text>
          </View>
        </View>

        {/* Compteur de prix */}
        <PriceCounter
          initialPrice={currentRide.price}
          isRunning={taxiProgress < 100}
          incrementRate={0.5}
        />

        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeItem}>
            <Text style={styles.routeIcon}>📍</Text>
            <Text style={styles.routeText}>{currentRide.departure.name}</Text>
          </View>
          <View style={styles.routeArrow}>
            <Text style={styles.arrowText}>↓</Text>
          </View>
          <View style={styles.routeItem}>
            <Text style={styles.routeIcon}>🎯</Text>
            <Text style={styles.routeText}>{currentRide.destination.name}</Text>
          </View>
        </View>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${taxiProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {taxiProgress >= 100 ? 'Arrivée !' : `${Math.round(taxiProgress)}% du trajet`}
          </Text>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          {taxiProgress < 100 ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>✕ Annuler la course</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Text style={styles.completeBtnText}>✓ Terminer la course</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#6B7280',
  },
  markerDeparture: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDestination: {
    width: 40,
    height: 40,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 20,
  },
  rideInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  carInfo: {
    fontSize: 13,
    color: '#6B7280',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  routeCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  routeText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  routeArrow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrowText: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});