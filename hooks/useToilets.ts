import { useState } from 'react';
import { Alert } from 'react-native';
import { Toilet, OverpassElement } from '../types/toilet';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export function useToilets() {
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchToilets = async (lat: number, lon: number, radiusKm: number) => {
    if (loading) return;
    setLoading(true);

    const radiusMeters = radiusKm * 1000;

    const overpassQuery = `[out:json][timeout:25];(
      node["amenity"="toilets"](around:${radiusMeters},${lat},${lon});
      way["amenity"="toilets"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="toilets"](around:${radiusMeters},${lat},${lon});
    );out center tags;`;

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      if (!data?.elements || !Array.isArray(data.elements)) {
        throw new Error('Réponse invalide de Overpass API');
      }

      const toiletMarkers: Toilet[] = data.elements
        .map((el: OverpassElement) => {
          let latToilet, lonToilet;
          if (el.type === 'node') {
            latToilet = el.lat;
            lonToilet = el.lon;
          } else if (el.center) {
            latToilet = el.center.lat;
            lonToilet = el.center.lon;
          } else return null;

          if (!latToilet || !lonToilet) return null;

          return {
            id: el.id,
            latitude: latToilet,
            longitude: lonToilet,
            title: 'Toilettes publiques',
            description: el.tags?.name || 'Toilettes publiques',
            fee:
              el.tags?.fee === 'yes'
                ? 'Payant'
                : el.tags?.fee === 'no'
                  ? 'Gratuit'
                  : 'Inconnu',
            wheelchair:
              el.tags?.wheelchair === 'yes'
                ? 'Accessible'
                : el.tags?.wheelchair === 'no'
                  ? 'Non accessible'
                  : 'Inconnu',
          };
        })
        .filter(Boolean) as Toilet[];

      if (toiletMarkers.length === 0) {
        Alert.alert('Aucune toilette trouvée', 'Aucune toilette valide dans ce rayon.');
      }

      setToilets(toiletMarkers);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de charger les toilettes.');
    } finally {
      setLoading(false);
    }
  };

  return { toilets, fetchToilets, loading };
}
