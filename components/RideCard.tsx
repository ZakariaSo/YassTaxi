import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ride } from '../store/useStore';

interface RideCardProps {
  ride: Ride;
  onPress?: () => void;
  onDelete?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onPress, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(ride.startTime)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {ride.isNight ? '🌙 Nuit' : '☀️ Jour'}
          </Text>
        </View>
      </View>

      <View style={styles.route}>
        <Text style={styles.location}>📍 {ride.departure.name}</Text>
        <Text style={styles.arrow}>↓</Text>
        <Text style={styles.location}>🎯 {ride.destination.name}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.detail}>{ride.distance.toFixed(1)} km</Text>
        <Text style={styles.detail}>•</Text>
        <Text style={styles.detail}>{ride.duration} min</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>{ride.price.toFixed(2)} DH</Text>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '600',
  },
  route: {
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#111827',
    marginVertical: 2,
  },
  arrow: {
    fontSize: 16,
    color: '#9CA3AF',
    marginVertical: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
});