import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useStore } from '../store/useStore';
import { calculateDistance, calculateDuration, calculatePrice } from '../utils/calculations';
import { LOCATIONS, Location } from '../utils/locations';

export default function BookingScreen() {
  const router = useRouter();
  const { isNightMode, startRide } = useStore();

  const [departure, setDeparture] = useState<Location>(LOCATIONS[1]); // Gare
  const [destination, setDestination] = useState<Location>(LOCATIONS[2]); // Morocco Mall

  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  const distance = calculateDistance(
    departure.latitude,
    departure.longitude,
    destination.latitude,
    destination.longitude
  );
  const price = calculatePrice(distance, isNightMode);
  const duration = calculateDuration(distance);

  const handleConfirm = () => {
    const ride = {
      id: Date.now().toString(),
      departure,
      destination,
      distance,
      price,
      duration,
      startTime: new Date(),
      isNight: isNightMode,
    };

    startRide(ride);
    router.push('/ride');
  };

  const LocationModal = ({
    visible,
    onClose,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    onSelect: (loc: Location) => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalList}>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.modalItem}
                onPress={() => {
                  onSelect(loc);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseBtnText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Réservation</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Départ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📍 Point de départ</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowDepartureModal(true)}
          >
            <Text style={styles.selectText}>{departure.name}</Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎯 Destination</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowDestinationModal(true)}
          >
            <Text style={styles.selectText}>{destination.name}</Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Estimation */}
        <View style={styles.estimateCard}>
          <Text style={styles.estimateTitle}>Estimation de la course</Text>

          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Distance</Text>
            <Text style={styles.estimateValue}>{distance.toFixed(1)} km</Text>
          </View>

          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Temps estimé</Text>
            <Text style={styles.estimateValue}>{duration} min</Text>
          </View>

          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Tarif appliqué</Text>
            <Text style={styles.estimateValue}>
              {isNightMode ? '🌙 Nuit' : '☀️ Jour'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix estimé</Text>
            <Text style={styles.priceValue}>{price.toFixed(2)} DH</Text>
          </View>

          <Text style={styles.priceNote}>
            * Prise en charge: 7.50 DH + {isNightMode ? '2.00' : '1.50'} DH/km
          </Text>
        </View>

        {/* Bouton de confirmation */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>✓ Confirmer la réservation</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Un taxi rouge sera assigné immédiatement après confirmation
          </Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <LocationModal
        visible={showDepartureModal}
        onClose={() => setShowDepartureModal(false)}
        onSelect={setDeparture}
        title="Choisir le point de départ"
      />

      <LocationModal
        visible={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        onSelect={setDestination}
        title="Choisir la destination"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  select: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  selectArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  estimateCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  estimateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 16,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estimateLabel: {
    fontSize: 15,
    color: '#92400E',
  },
  estimateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#78350F',
  },
  divider: {
    height: 1,
    backgroundColor: '#FCD34D',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350F',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  priceNote: {
    fontSize: 12,
    color: '#92400E',
    fontStyle: 'italic',
    marginTop: 4,
  },
  confirmBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalCloseBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});