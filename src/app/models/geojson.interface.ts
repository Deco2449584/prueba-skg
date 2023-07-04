// geojson.interface.ts

export interface GeoJSONData {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  id: number;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  OBJECTID: number;
  ID: number;
  TIPO: string;
  N_RUTAS: number;
  ADMINISTRA: string;
  UBICACION: string;
  FOTOS: string;
  ESTADO_DE_SENAL: string | null;
  ESTADO_DE_DEMARCA: string | null;
  ESTADO_DE_CASETA: string | null;
  TIPO_CASETA: string | null;
  DANOS: string | null;
  OBSERVACIONES: string | null;
}
