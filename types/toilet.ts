export interface Toilet {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  fee: string;
  wheelchair: string;
  access: string;
  openingHours?: string;
}

export interface OverpassElement {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; fee?: 'yes' | 'no'; wheelchair?: 'yes' | 'no' };
}