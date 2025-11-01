/**
 * Namibia Locations Data
 *
 * Contains location data for Namibia including regions, cities, and tourist destinations
 * Location: lib/data/namibia-locations.ts
 */

export interface Location {
  id: string;
  name: string;
  type: 'region' | 'city' | 'tourist' | 'business';
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
}

export const namibiaRegions: Location[] = [
  {
    id: 'khomas',
    name: 'Khomas',
    type: 'region',
    coordinates: { lat: -22.5609, lng: 17.0658 },
  },
  {
    id: 'erongo',
    name: 'Erongo',
    type: 'region',
    coordinates: { lat: -22.0, lng: 15.0 },
  },
  {
    id: 'hardap',
    name: 'Hardap',
    type: 'region',
    coordinates: { lat: -24.0, lng: 16.0 },
  },
  {
    id: 'karas',
    name: 'Karas',
    type: 'region',
    coordinates: { lat: -26.0, lng: 18.0 },
  },
  {
    id: 'kavango-east',
    name: 'Kavango East',
    type: 'region',
    coordinates: { lat: -18.0, lng: 20.0 },
  },
  {
    id: 'kavango-west',
    name: 'Kavango West',
    type: 'region',
    coordinates: { lat: -18.0, lng: 19.0 },
  },
  {
    id: 'kunene',
    name: 'Kunene',
    type: 'region',
    coordinates: { lat: -19.0, lng: 13.0 },
  },
  {
    id: 'ohangwena',
    name: 'Ohangwena',
    type: 'region',
    coordinates: { lat: -17.0, lng: 16.0 },
  },
  {
    id: 'omaheke',
    name: 'Omaheke',
    type: 'region',
    coordinates: { lat: -22.0, lng: 19.0 },
  },
  {
    id: 'omusati',
    name: 'Omusati',
    type: 'region',
    coordinates: { lat: -18.0, lng: 15.0 },
  },
  {
    id: 'oshana',
    name: 'Oshana',
    type: 'region',
    coordinates: { lat: -18.0, lng: 16.0 },
  },
  {
    id: 'oshikoto',
    name: 'Oshikoto',
    type: 'region',
    coordinates: { lat: -18.0, lng: 17.0 },
  },
  {
    id: 'otjozondjupa',
    name: 'Otjozondjupa',
    type: 'region',
    coordinates: { lat: -20.0, lng: 17.0 },
  },
  {
    id: 'zambezi',
    name: 'Zambezi',
    type: 'region',
    coordinates: { lat: -17.0, lng: 24.0 },
  },
];

export const namibiaCities: Location[] = [
  {
    id: 'windhoek',
    name: 'Windhoek',
    type: 'city',
    region: 'Khomas',
    coordinates: { lat: -22.5609, lng: 17.0658 },
    description: 'Capital city of Namibia',
  },
  {
    id: 'swakopmund',
    name: 'Swakopmund',
    type: 'city',
    region: 'Erongo',
    coordinates: { lat: -22.6783, lng: 14.5266 },
    description: 'Coastal city and tourist destination',
  },
  {
    id: 'walvis-bay',
    name: 'Walvis Bay',
    type: 'city',
    region: 'Erongo',
    coordinates: { lat: -22.9576, lng: 14.5053 },
    description: 'Major port city',
  },
  {
    id: 'otjiwarongo',
    name: 'Otjiwarongo',
    type: 'city',
    region: 'Otjozondjupa',
    coordinates: { lat: -20.4642, lng: 16.6477 },
    description: 'Agricultural center',
  },
  {
    id: 'oshakati',
    name: 'Oshakati',
    type: 'city',
    region: 'Oshana',
    coordinates: { lat: -17.7886, lng: 15.6886 },
    description: 'Northern commercial center',
  },
  {
    id: 'rundu',
    name: 'Rundu',
    type: 'city',
    region: 'Kavango East',
    coordinates: { lat: -17.9332, lng: 19.7665 },
    description: 'Northern border town',
  },
  {
    id: 'katima-mulilo',
    name: 'Katima Mulilo',
    type: 'city',
    region: 'Zambezi',
    coordinates: { lat: -17.5039, lng: 24.2753 },
    description: 'Eastern border town',
  },
  {
    id: 'gobabis',
    name: 'Gobabis',
    type: 'city',
    region: 'Omaheke',
    coordinates: { lat: -22.4474, lng: 18.9635 },
    description: 'Eastern agricultural center',
  },
  {
    id: 'keetmanshoop',
    name: 'Keetmanshoop',
    type: 'city',
    region: 'Karas',
    coordinates: { lat: -26.5833, lng: 18.1333 },
    description: 'Southern city',
  },
  {
    id: 'luderitz',
    name: 'Luderitz',
    type: 'city',
    region: 'Karas',
    coordinates: { lat: -26.6481, lng: 15.1538 },
    description: 'Coastal fishing town',
  },
];

export const namibiaTouristDestinations: Location[] = [
  {
    id: 'sossusvlei',
    name: 'Sossusvlei',
    type: 'tourist',
    region: 'Hardap',
    coordinates: { lat: -24.7333, lng: 15.3667 },
    description: 'Famous red sand dunes',
  },
  {
    id: 'etosha-national-park',
    name: 'Etosha National Park',
    type: 'tourist',
    region: 'Kunene',
    coordinates: { lat: -18.8333, lng: 16.3333 },
    description: 'Wildlife sanctuary',
  },
  {
    id: 'fish-river-canyon',
    name: 'Fish River Canyon',
    type: 'tourist',
    region: 'Karas',
    coordinates: { lat: -27.5833, lng: 17.5833 },
    description: 'Second largest canyon in the world',
  },
  {
    id: 'skeleton-coast',
    name: 'Skeleton Coast',
    type: 'tourist',
    region: 'Kunene',
    coordinates: { lat: -20.0, lng: 13.0 },
    description: 'Desert coastline',
  },
  {
    id: 'waterberg-plateau',
    name: 'Waterberg Plateau',
    type: 'tourist',
    region: 'Otjozondjupa',
    coordinates: { lat: -20.5, lng: 17.2 },
    description: 'Mountain plateau and national park',
  },
  {
    id: 'spitzkoppe',
    name: 'Spitzkoppe',
    type: 'tourist',
    region: 'Erongo',
    coordinates: { lat: -21.8, lng: 15.2 },
    description: 'Granite mountain formation',
  },
  {
    id: 'twyfelfontein',
    name: 'Twyfelfontein',
    type: 'tourist',
    region: 'Kunene',
    coordinates: { lat: -20.5833, lng: 14.3667 },
    description: 'UNESCO World Heritage rock art site',
  },
  {
    id: 'caprivi-strip',
    name: 'Caprivi Strip',
    type: 'tourist',
    region: 'Zambezi',
    coordinates: { lat: -17.5, lng: 24.0 },
    description: 'Narrow strip of land with rivers and wildlife',
  },
];

export const namibiaBusinessDistricts: Location[] = [
  {
    id: 'windhoek-cbd',
    name: 'Windhoek CBD',
    type: 'business',
    region: 'Khomas',
    coordinates: { lat: -22.5609, lng: 17.0658 },
    description: 'Central business district',
  },
  {
    id: 'swakopmund-industrial',
    name: 'Swakopmund Industrial',
    type: 'business',
    region: 'Erongo',
    coordinates: { lat: -22.6783, lng: 14.5266 },
    description: 'Industrial and port area',
  },
  {
    id: 'walvis-bay-port',
    name: 'Walvis Bay Port',
    type: 'business',
    region: 'Erongo',
    coordinates: { lat: -22.9576, lng: 14.5053 },
    description: 'Major port and logistics hub',
  },
  {
    id: 'oshakati-commercial',
    name: 'Oshakati Commercial',
    type: 'business',
    region: 'Oshana',
    coordinates: { lat: -17.7886, lng: 15.6886 },
    description: 'Northern commercial center',
  },
];

export const allNamibiaLocations: Location[] = [
  ...namibiaRegions,
  ...namibiaCities,
  ...namibiaTouristDestinations,
  ...namibiaBusinessDistricts,
];

export const getLocationsByType = (type: Location['type']): Location[] => {
  return allNamibiaLocations.filter((location) => location.type === type);
};

export const getLocationsByRegion = (region: string): Location[] => {
  return allNamibiaLocations.filter((location) => location.region === region);
};

export const searchLocations = (query: string): Location[] => {
  const lowercaseQuery = query.toLowerCase();
  return allNamibiaLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(lowercaseQuery) ||
      location.description?.toLowerCase().includes(lowercaseQuery) ||
      location.region?.toLowerCase().includes(lowercaseQuery)
  );
};

// Service class for location operations
export class NamibiaLocationService {
  static getAllRegions(): Location[] {
    return namibiaRegions;
  }

  static getBusinessLocations(): Location[] {
    return allNamibiaLocations.filter(
      (location) => location.type === 'business'
    );
  }

  static getTouristLocations(): Location[] {
    return allNamibiaLocations.filter(
      (location) => location.type === 'tourist'
    );
  }

  static searchLocations(query: string): Location[] {
    return searchLocations(query);
  }

  static getNearbyLocations(
    lat: number,
    lng: number,
    radius: number = 50
  ): Location[] {
    return allNamibiaLocations.filter((location) => {
      if (!location.coordinates) return false;

      const distance = calculateDistance(
        lat,
        lng,
        location.coordinates.lat,
        location.coordinates.lng
      );

      return distance <= radius;
    });
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
