import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RideCard } from '../components/RideCard';
import { useStore } from '../store/useStore';

export default function HistoryScreen() {
  const { 
    rideHistory, 
    removeFromHistory, 
    clearHistory, 
    getTotalSpent, 
    getTotalRides 
  } = useStore();
  
  // Debug : Afficher l'historique au chargement
  useEffect(() => {
    console.log('📊 Historique chargé:', rideHistory.length, 'courses');
    console.log('📋 Détails:', rideHistory);
  }, [rideHistory]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Supprimer cette course',
      'Voulez-vous vraiment supprimer cette course de l\'historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('Suppression de:', id);
            removeFromHistory(id);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (rideHistory.length === 0) return;

    Alert.alert(
      'Effacer tout l\'historique',
      'Cette action est irréversible. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Tout effacer',
          style: 'destructive',
          onPress: () => {
            console.log('Effacement de tout l\'historique');
            clearHistory();
          },
        },
      ]
    );
  };

  // Afficher le nombre de courses dans la console
  console.log('🔄 Rendu du composant History avec', rideHistory.length, 'courses');

  return (
    <View style={styles.container}>
      {/* Header */}
     <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.backBtn}>← </Text>
        </TouchableOpacity>
        <Text style={styles.title}>📋 Historique</Text>
        {rideHistory.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearBtn}>🗑️ Effacer tout</Text>
          </TouchableOpacity>
          
        )}
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getTotalRides()}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{getTotalSpent().toFixed(2)} DH</Text>
          <Text style={styles.statLabel}>Total dépensé</Text>
        </View>
      </View>

      {/* Debug Info */}
      <View style={styles.debugBox}>
        <Text style={styles.debugText}>
          🔍 Debug: {rideHistory.length} course(s) dans l'historique
        </Text>
      </View>

      {/* Liste des courses */}
      {rideHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚕</Text>
          <Text style={styles.emptyTitle}>Aucune course</Text>
          <Text style={styles.emptyText}>
            Votre historique de courses apparaîtra ici
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {rideHistory.map((ride, index) => {
            console.log(`Affichage de la course ${index}:`, ride.id);
            return (
              <RideCard
                key={ride.id}
                ride={ride}
                onDelete={() => handleDelete(ride.id)}
              />
            );
          })}
          <View style={styles.listFooter}>
            <Text style={styles.footerText}>
              Fin de l'historique
            </Text>
          </View>
        </ScrollView>
      )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 80
  },
  clearBtn: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  debugBox: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  debugText: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  listFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
    backBtn: {
    fontSize:25,
    color: '#EF4444',
    fontWeight: '600',
  },
});