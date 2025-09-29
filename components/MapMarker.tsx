import React, { useEffect } from 'react';
import { Marker } from 'react-native-maps';
import { Animated, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import styles from '../styles/MapMarker_styles';
import { Toilet } from '../types/toilet';

type Props = {
  data: Toilet;
  openMaps: (lat: number, lon: number) => void;
  selectedToilet: Toilet | null;
  setSelectedToilet: (toilet: Toilet | null) => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function MapMarker({ data, openMaps, selectedToilet, setSelectedToilet }: Props) {
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (selectedToilet?.id === data.id) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 6 }),
      ]).start();
    }
  }, [selectedToilet]);

  const getStatusColor = (status: string, type: 'fee' | 'wheelchair' | 'access') => {
    if (type === 'fee') return status === 'Gratuit' ? '#10B981' : status === 'Payant' ? '#F59E0B' : '#6B7280';
    if (type === 'wheelchair') return status === 'Accessible' ? '#10B981' : status === 'Non accessible' ? '#EF4444' : '#6B7280';
    if (type === 'access') return status === 'Publique' ? '#10B981' : '#6B7280';
    return '#6B7280';
  };

  const InfoRow = ({ icon, label, value, type }: { icon: string; label: string; value: string; type?: 'fee' | 'wheelchair' | 'access' }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: type ? getStatusColor(value, type) : '#6B7280' }]}>
        <Text style={styles.statusText}>{value}</Text>
      </View>
    </View>
  );

  const closeCard = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 350, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setSelectedToilet(null);
    });
  };

  return (
    <>
      <Marker
        key={data.id}
        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        pinColor={data.fee === 'Payant' ? 'red' : '#4A90E2'}
        onPress={() => setSelectedToilet(data)}
      />

      {selectedToilet?.id === data.id && (
        <Animated.View
          style={[styles.infoCard, { transform: [{ translateY: slideAnim }, { scale: scaleAnim }], opacity: fadeAnim }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>🚻 {selectedToilet.title}</Text>
                <Text style={styles.subtitle}>{selectedToilet.description}</Text>
              </View>
              <TouchableOpacity onPress={closeCard} style={styles.closeButton} activeOpacity={0.7}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoContainer}>
              <InfoRow icon="💰" label="Tarif" value={selectedToilet.fee} type="fee" />
              <InfoRow icon="🕒" label="Horaires" value={selectedToilet.openingHours || 'Non spécifié'} />
              <InfoRow icon="🚪" label="Accès" value={selectedToilet.access || 'Inconnu'} type="access" />
              <InfoRow icon="♿" label="Accessibilité" value={selectedToilet.wheelchair} type="wheelchair" />
            </View>
            <TouchableOpacity onPress={() => openMaps(selectedToilet.latitude, selectedToilet.longitude)} style={{ marginTop: 20 }}>
              <Text style={{ color: '#2563EB', fontWeight: 'bold', textAlign: 'center' }}>🗺️ Ouvrir l’itinéraire</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}
