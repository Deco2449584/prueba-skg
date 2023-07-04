// Importar los módulos y servicios necesarios
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { DataService } from '../../data/data.service';

// Decorador del componente
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  // Inyectar el servicio DataService
  constructor(private dataService: DataService) {}
  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    // Crear una nueva instancia del objeto Map de mapboxgl
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-75.49806374151461, 5.067157286210732],
      zoom: 9,
      attributionControl: false,
      accessToken: (mapboxgl as any).accessToken || environment.mapboxToken,
    });

    // Escuchar el evento 'style.load' del mapa
    map.on('style.load', () => {
      // Añadir el control de navegación al mapa
      map.addControl(new mapboxgl.NavigationControl());

      // Obtener los datos del servicio DataService
      this.dataService.getDatosFromAPI().subscribe((data: any) => {
        // Procesar los datos recibidos y agregarlos al mapa
        if (data && data.features) {
          // Remover la fuente de datos existente si existe
          if (map.getSource('datos')) {
            map.removeSource('datos');
          }
          // Añadir la fuente de datos al mapa
          map.addSource('datos', {
            type: 'geojson',
            data: data,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
          });

          // Crear una imagen para el icono de parada de autobús
          const image = new Image();
          image.src = '../../../assets/img/map-bus-stop.png';
          // Cuando la imagen se ha cargado
          image.onload = () => {
            // Crear un lienzo de dibujo y obtener el contexto
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            // Establecer las dimensiones del lienzo
            canvas.width = image.width;
            canvas.height = image.height;
            // Dibujar la imagen en el lienzo
            context?.drawImage(image, 0, 0);
            // Obtener los datos de la imagen
            const imageData = context?.getImageData(
              0,
              0,
              image.width,
              image.height
            );
            if (imageData) {
              // Añadir la imagen al mapa como un icono
              map.addImage('bus-stop-icon', imageData);

              // Añadir una capa para los clusters
              map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'datos',
                filter: ['has', 'point_count'],
                paint: {
                  'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1',
                  ],
                  'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40,
                  ],
                },
              });

              // Añadir una capa para el recuento de clusters
              map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'datos',
                filter: ['has', 'point_count'],
                layout: {
                  'text-field': '{point_count_abbreviated}',
                  'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                  'text-size': 12,
                },
              });

              // Añadir una capa para los puntos individuales (paradas de autobús)
              map.addLayer({
                id: 'unclustered-point',
                type: 'symbol',
                source: 'datos',
                filter: ['!', ['has', 'point_count']],
                layout: {
                  'icon-image': 'bus-stop-icon',
                  'icon-size': 0.5,
                  'icon-allow-overlap': true,
                },
              });
            }
          };
        }
      });
    });
  }

  ngOnInit() {
    // Código de inicialización adicional si es necesario
  }
}
