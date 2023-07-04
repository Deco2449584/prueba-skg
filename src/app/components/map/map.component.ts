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
  showData: boolean = true;

  // Inyectar el servicio DataService
  constructor(private dataService: DataService) {}

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    // Crear una nueva instancia del objeto Map de mapboxgl
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
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
          // Añadir la fuente de datos al mapa
          map.addSource('datos', {
            type: 'geojson',
            data: data,
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

              // Añadir una capa al mapa utilizando el icono personalizado
              map.addLayer({
                id: 'datos-layer',
                type: 'symbol',
                source: 'datos',
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
