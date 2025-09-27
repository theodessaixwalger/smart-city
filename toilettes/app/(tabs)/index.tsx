import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface Toilet {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  fee: string;
  wheelchair: string;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function ToiletsMap() {
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 46.603354,
    longitude: 1.888334,
    latitudeDelta: 8,
    longitudeDelta: 8,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        fetchToilets(location.coords.latitude, location.coords.longitude, 0.02);
      }
    } catch (error) {
      console.log('Erreur localisation:', error);
    }
  };

  const fetchToilets = async (lat: number, lon: number, radius: number) => {
    if (loading) return;
    
    setLoading(true);
    
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="toilets"](around:${radius * 111000},${lat},${lon});
        way["amenity"="toilets"](around:${radius * 111000},${lat},${lon});
        relation["amenity"="toilets"](around:${radius * 111000},${lat},${lon});
      );
      out center meta;
    `;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      const data = await response.json();
      
      const toiletMarkers: Toilet[] = data.elements.map((element: any) => {
        let lat: number, lon: number;
        
        if (element.type === 'node') {
          lat = element.lat;
          lon = element.lon;
        } else if (element.center) {
          lat = element.center.lat;
          lon = element.center.lon;
        } else {
          return null;
        }

        return {
          id: element.id,
          latitude: lat,
          longitude: lon,
          title: 'Toilettes publiques',
          description: element.tags?.name || 'Toilettes publiques',
          fee: element.tags?.fee === 'yes' ? 'Payant' : element.tags?.fee === 'no' ? 'Gratuit' : 'Inconnu',
          wheelchair: element.tags?.wheelchair === 'yes' ? 'Accessible' : element.tags?.wheelchair === 'no' ? 'Non accessible' : 'Inconnu',
        };
      }).filter(Boolean);

      setToilets(toiletMarkers);
      
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données des toilettes');
      console.error('Erreur fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    const latDiff = Math.abs(newRegion.latitude - region.latitude);
    const lonDiff = Math.abs(newRegion.longitude - region.longitude);
    
    if (latDiff > 0.01 || lonDiff > 0.01) {
      setRegion(newRegion);
      fetchToilets(newRegion.latitude, newRegion.longitude, newRegion.latitudeDelta);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {toilets.map((toilet) => (
          <Marker
            key={toilet.id}
            coordinate={{
              latitude: toilet.latitude,
              longitude: toilet.longitude,
            }}
            title={toilet.title}
            description={`${toilet.description}\n💰 ${toilet.fee}\n♿ ${toilet.wheelchair}`}
            pinColor="#4A90E2"
          />
        ))}
      </MapView>
      
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
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
  loading: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});