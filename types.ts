
export enum Category {
  RESTAURANT = '餐廳',
  STREET_FOOD = '特色小吃',
  SCENIC = '風景',
  DATING = '約會',
  FUN = '有趣'
}

export enum TransportationMode {
  CAR = '汽車',
  SCOOTER = '機車',
  BICYCLE = '腳踏車',
  WALKING = '走路'
}

export interface Attraction {
  id: string;
  region: string;
  district: string;
  name: string;
  category: Category;
  description: string;
  suggestedDuration: string;
  address: string;
  rating: number;
  popularity: number;
  lat?: number;
  lng?: number;
}

export interface DataStructure {
  lastUpdated: string;
  attractions: Attraction[];
}

export interface FilterState {
  searchTerm: string;
  selectedRegions: string[];
  selectedDistricts: string[];
  travelDays: number;
  transportMode: TransportationMode;
}
