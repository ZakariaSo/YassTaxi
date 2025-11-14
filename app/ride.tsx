import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,

    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { PriceCounter } from '../components/PriceCounter';
import { useStore } from '../store/useStore';

export default function RideScreen() {
     const offset = useSharedValue({ y: 0 });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value.y }],
  }));
  
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        const maxUp = 0;
        const maxDown = 400;
    
      offset.value = {
        y: Math.min(Math.max(e.translationY, maxUp), maxDown),
      };
    })
  
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
            router.replace('/history');
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Course terminée',
      `Merci d'avoir utilisé YassTaxi Casa !\nPrix final: ${currentRide?.price.toFixed(
        2
      )} DH`,
      [
        {
          text: 'OK',
          onPress: () => {
            endRide();
            router.push('/history');
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
        <Marker coordinate={taxiPosition} image={require("../assets/taxi1.png")}>
        </Marker>
      </MapView>

      {/* Informations de la course - Version compacte */}
      <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.rideInfo,animatedStyle]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Carte chauffeur - Version compacte */}
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>Z</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Zakatia Sobahi</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ 4.9</Text>
                <Text style={styles.carInfo}>🚗 Petit Taxi Rouge • 4521</Text>
              </View>
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

          {/* Route - Version compacte */}
          <View style={styles.routeCard}>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>📍</Text>
              <Text style={styles.routeText} numberOfLines={1}>{currentRide.departure.name}</Text>
            </View>
            <View style={styles.routeArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>🎯</Text>
              <Text style={styles.routeText} numberOfLines={1}>{currentRide.destination.name}</Text>
            </View>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${taxiProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {taxiProgress >= 100 ? 'Arrivée !' : `${Math.round(taxiProgress)}%`}
            </Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            {taxiProgress < 100 ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>✕ Annuler</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                <Text style={styles.completeBtnText}>✓ Terminer</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </Animated.View>
        </GestureDetector>
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
    maxHeight: '80%', // Limite la hauteur à 50% de l'écran
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  driverInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  carInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  routeCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  routeText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  routeArrow: {
    marginHorizontal: 8,
  },
  arrowText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 4,
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: 'bold',
  },
  completeBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});