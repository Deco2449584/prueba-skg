// Importar los módulos y servicios necesarios
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoJSONData } from '../models/geojson.interface';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Decorador del servicio
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Método para obtener datos del API
  getDatosFromAPI() {
    // URL del API de donde se obtendrán los datos
    const url =
      'https://sigmzl.manizales.gov.co/wadmzl/rest/services/MOVILIDAD/Inventario_Vial/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson';

    // Realizar la solicitud HTTP GET al API y manejar los errores
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
            // ...
            // Se agregan más objetos Feature con datos por defecto
            // ...
          ],
        };

        // Se devuelve un observable que emite el valor por defecto
        return of(defaultValue);
      })
    );
  }
}
