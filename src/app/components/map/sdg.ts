// Importar los módulos y servicios necesarios
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { DataService } from '../../data/data.service';
import {
  GeoJSONData,
  Feature,
  Geometry,
  Properties,
} from '../../models/geojson.interface';

// Decorador del componente
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() capa: boolean = true;

  // Inyectar el servicio DataService
  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Verificar si hubo cambios en la entrada 'capa'
    if (changes.capa && !changes.capa.firstChange) {
      const newValue = changes.capa.currentValue;
      // Realizar las acciones correspondientes al cambio de 'capa'
      if (newValue) {
        // Mostrar la capa en el mapa
        // ...
      } else {
        // Ocultar la capa en el mapa
        // ...
      }
    }
  }

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    // Resto del código...
  }

  ngOnInit() {
    // Código de inicialización adicional si es necesario
  }
}
