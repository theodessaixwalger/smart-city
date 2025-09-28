import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, ActivityIndicator, TouchableOpacity, Text, Linking } from 'react-native';
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import styles from "../styles/ToiletsMap_styles";
import Filters from '../components/Filters';
import MapMarker from '../components/MapMarker';
import SearchBar from '../components/SearchBar';
import { useToilets } from '../hooks/useToilets';
import useDebounce from '../hooks/useDebounce';
import { Toilet } from '../types/toilet';

export default function ToiletsMap() {
  const { toilets, fetchToilets, loading } = useToilets();
  const [region, setRegion] = useState<Region>({
    latitude: 48.858844,
    longitude: 2.294351,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [radius, setRadius] = useState(2);
  const [filterFee, setFilterFee] = useState<'all' | 'free' | 'paid'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [address, setAddress] = useState('');
  const [addressPosition, setAddressPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);


  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Impossible d’accéder à votre position.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      if (!location?.coords) {
        Alert.alert('Erreur', 'Position non disponible.');
        return;
      }

      const newRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setRegion(newRegion);
      fetchToilets(location.coords.latitude, location.coords.longitude, radius);
    } catch (error) {
      console.error('Erreur localisation:', error);
      Alert.alert('Erreur', 'Impossible de récupérer votre localisation.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const searchAddress = useCallback(
    useDebounce(async () => {
      if (!address.trim()) return;
      setSearchLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          Alert.alert('Adresse non trouvée', 'Veuillez entrer une adresse valide.');
          return;
        }

        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        if (isNaN(lat) || isNaN(lon)) {
          Alert.alert('Erreur', 'Coordonnées invalides.');
          return;
        }

        const newRegion: Region = {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setRegion(newRegion);
        setAddressPosition({ latitude: lat, longitude: lon });
        fetchToilets(lat, lon, radius);
      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Impossible de rechercher l’adresse.');
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    [address, radius]
  );

  const openMaps = (lat: number, lon: number) => {
    if (!lat || !lon) {
      Alert.alert('Erreur', 'Coordonnées invalides.');
      return;
    }
    Alert.alert('Itinéraire', 'Ouvrir dans :', [
      {
        text: 'Google Maps',
        onPress: () =>
          Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`),
      },
      {
        text: 'Apple Plans',
        onPress: () => Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lon}`),
      },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const filteredToilets = toilets.filter((t) => {
    if (filterFee === 'free') return t.fee === 'Gratuit';
    if (filterFee === 'paid') return t.fee === 'Payant';
    return true;
  });

  return (
    <View style={styles.container}>
      <SearchBar
        address={address}
        setAddress={setAddress}
        searchAddress={searchAddress}
        searchLoading={searchLoading}
      />

      <MapView style={styles.map} region={region} showsUserLocation>
        <Circle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={radius * 1000}
          strokeColor="rgba(74,144,226,0.5)"
          fillColor="rgba(74,144,226,0.2)"
        />

        {addressPosition && (
          <Marker coordinate={addressPosition} pinColor="green" title="Adresse recherchée" />
        )}

        {filteredToilets.map((t) => (
          <MapMarker
            key={t.id}
            data={t}
            openMaps={openMaps}
            selectedToilet={selectedToilet}
            setSelectedToilet={setSelectedToilet}
          />

        ))}
      </MapView>

      <TouchableOpacity style={styles.fab} onPress={getCurrentLocation}>
        <Ionicons name="locate" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Filtres</Text>
      </TouchableOpacity>

      <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        radius={radius}
        setRadius={setRadius}
        filterFee={filterFee}
        setFilterFee={setFilterFee}
        onRadiusChange={(val) => fetchToilets(region.latitude, region.longitude, val)}
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </View>
  );
}
