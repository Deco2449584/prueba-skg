import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoJSONData } from '../models/geojson.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getDatosFromAPI() {
    const url =
      'https://sigmzl.manizales.gov.co/wadmzl/rest/services/MOVILIDAD/Inventario_Vial/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';

    return this.http.get<GeoJSONData>(url).pipe(
      catchError(() => {
        // En caso de error, se devuelve un valor por defecto o se maneja de alguna forma específica.
        const defaultValue: GeoJSONData = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id: 1,
              geometry: {
                type: 'Point',
                coordinates: [-75.531983, 5.06889],
              },
              properties: {
                OBJECTID: 1,
                ID: 1001,
                TIPO: 'Punto de interés',
                N_RUTAS: 2,
                ADMINISTRA: 'Admin1',
                UBICACION: 'Ubicación 1',
                FOTOS: 'foto1.jpg',
                ESTADO_DE_SENAL: 'Bueno',
                ESTADO_DE_DEMARCA: 'Bueno',
                ESTADO_DE_CASETA: null,
                TIPO_CASETA: null,
                DANOS: null,
                OBSERVACIONES: null,
              },
            },
            {
              type: 'Feature',
              id: 2,
              geometry: {
                type: 'Point',
                coordinates: [-75.508947, 5.071071],
              },
              properties: {
                OBJECTID: 2,
                ID: 1002,
                TIPO: 'Punto de interés',
                N_RUTAS: 1,
                ADMINISTRA: 'Admin2',
                UBICACION: 'Ubicación 2',
                FOTOS: 'foto2.jpg',
                ESTADO_DE_SENAL: 'Bueno',
                ESTADO_DE_DEMARCA: 'Bueno',
                ESTADO_DE_CASETA: 'Bueno',
                TIPO_CASETA: 'Tipo1',
                DANOS: null,
                OBSERVACIONES: 'Observación 2',
              },
            },
            {
              type: 'Feature',
              id: 3,
              geometry: {
                type: 'Point',
                coordinates: [-75.486468, 5.071975],
              },
              properties: {
                OBJECTID: 3,
                ID: 1003,
                TIPO: 'Punto de interés',
                N_RUTAS: 3,
                ADMINISTRA: 'Admin3',
                UBICACION: 'Ubicación 3',
                FOTOS: 'foto3.jpg',
                ESTADO_DE_SENAL: 'Regular',
                ESTADO_DE_DEMARCA: 'Bueno',
                ESTADO_DE_CASETA: null,
                TIPO_CASETA: null,
                DANOS: 'Daño menor',
                OBSERVACIONES: 'Observación 3',
              },
            },
            {
              type: 'Feature',
              id: 4,
              geometry: {
                type: 'Point',
                coordinates: [-75.513279, 5.068486],
              },
              properties: {
                OBJECTID: 4,
                ID: 1004,
                TIPO: 'Punto de interés',
                N_RUTAS: 1,
                ADMINISTRA: 'Admin4',
                UBICACION: 'Ubicación 4',
                FOTOS: 'foto4.jpg',
                ESTADO_DE_SENAL: 'Bueno',
                ESTADO_DE_DEMARCA: 'Bueno',
                ESTADO_DE_CASETA: null,
                TIPO_CASETA: null,
                DANOS: null,
                OBSERVACIONES: null,
              },
            },
            {
              type: 'Feature',
              id: 5,
              geometry: {
                type: 'Point',
                coordinates: [-75.506219, 5.063183],
              },
              properties: {
                OBJECTID: 5,
                ID: 1005,
                TIPO: 'Punto de interés',
                N_RUTAS: 2,
                ADMINISTRA: 'Admin5',
                UBICACION: 'Ubicación 5',
                FOTOS: 'foto5.jpg',
                ESTADO_DE_SENAL: 'Bueno',
                ESTADO_DE_DEMARCA: 'Bueno',
                ESTADO_DE_CASETA: 'Bueno',
                TIPO_CASETA: 'Tipo2',
                DANOS: null,
                OBSERVACIONES: null,
              },
            },
          ],
        };

        return of(defaultValue);
      })
    );
  }
}
