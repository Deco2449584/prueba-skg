// Importar los módulos y servicios necesarios//////////////////////////////////////////
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
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

// Decorador del componente/////////////////////////////////////////////////////////
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})

// exportar la clase///////////////////////////////
export class MapComponent implements OnInit, AfterViewInit {
  private map!: mapboxgl.Map;
  //variable para activar o desactivar la capa
  @Input() capa: boolean = true;
  // Inyectar el servicio DataService
  constructor(private dataService: DataService) {}
  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    // Crear una nueva instancia del objeto Map de mapboxgl
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-75.49806374151461, 5.067157286210732],
      zoom: 19,
      attributionControl: false,
      accessToken: (mapboxgl as any).accessToken || environment.mapboxToken,
    });
    // Crear una instancia del popup fuera del evento para poder acceder a ella en ambos eventos
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // Escuchar el evento 'style.load' del mapa
    this.map.on('style.load', () => {
      //evento hover para los puntos uncluster
      this.map.on('mouseenter', 'unclustered-point', (e) => {
        this.map.getCanvas().style.cursor = 'pointer'; //cambia el cursor del mouse a una forma de puntero
        // recupera las características (elementos) que están siendo renderizadas en el punto del mapa donde ocurrió el evento.
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });
        //Se verifica si se encontraron características y si la lista tiene al menos un elemento.
        if (features && features.length > 0) {
          // Obtener las propiedades del primer elemento de la lista de características
          const clusterProperties = features[0].properties as {
            UBICACION: string;
            ID: string; // Se asume que hay una propiedad "ID" en las características
          };

          // Extraer los valores relevantes de las propiedades
          const clusterUbicacion = clusterProperties.UBICACION;
          const clusterID = clusterProperties.ID;

          // Configurar el contenido del popup con la información extraída, incluyendo el nuevo idText
          const popupContent = `
          <div id="custom-popup" style="background-color: #f8f8f8; color: #333; border-radius: 4px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15); padding: 10px;">
           <p style="margin: 0;"><strong>ID:</strong> ${clusterID}</p>
           <p style="margin: 0;"><strong>UBICACION:</strong> ${clusterUbicacion}</p>
             </div>
               `;
          // Establecer el contenido y la ubicación del popup
          popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(this.map);
        }
      });
      //evento unhover
      this.map.on('mouseleave', 'unclustered-point', () => {
        this.map.getCanvas().style.cursor = '';

        // Cerrar el popup
        popup.remove();
      });
      //evento click
      this.map.on('click', 'unclustered-point', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const geometry = feature.geometry as Geometry;
          const properties = feature.properties as Properties;

          if (geometry && geometry.coordinates) {
            const coordinates = geometry.coordinates.slice();
            /* const busStopName = properties.UBICACION || '';
            const busStopAddress = properties.ESTADO_DE_SENAL || ''; */

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates as mapboxgl.LngLatLike)
              .setHTML(
                `<div id="custom-popup" style="background-color: #f8f8f8; color: #333; border-radius: 4px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15); padding: 20px;">
      <h3 style="margin: 0 0 10px; font-size: 18px;">Información de parada de autobús</h3>
      <hr style="border-color: #ccc; margin-bottom: 10px;">
      <p style="margin-bottom: 5px;"><strong>TIPO:</strong> ${properties.TIPO}</p>
      <p style="margin-bottom: 5px;"><strong>ADMINISTRA:</strong> ${properties.ADMINISTRA}</p>
      <p style="margin-bottom: 5px;"><strong>N_RUTAS:</strong> ${properties.N_RUTAS}</p>
      <p style="margin-bottom: 5px;"><strong>UBICACION:</strong> ${properties.UBICACION}</p>
      <p style="margin-bottom: 0;"><strong>ID:</strong> ${properties.ID}</p>
    </div>
  `
              )
              .addTo(this.map);
          }
        }
      });

      // Añadir el control de navegación al mapa
      this.map.addControl(new mapboxgl.NavigationControl());

      // Obtener los datos del servicio DataService
      this.dataService.getDatosFromAPI().subscribe((data: any) => {
        // Procesar los datos recibidos y agregarlos al mapa
        if (data && data.features) {
          // Remover la fuente de datos existente si existe
          if (this.map.getSource('datos')) {
            this.map.removeSource('datos');
          }
          // Añadir la fuente de datos al mapa
          this.map.addSource('datos', {
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
              this.map.addImage('bus-stop-icon', imageData);

              // Añadir una capa para los clusters
              this.map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'datos',
                filter: ['has', 'point_count'],
                paint: {
                  'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#20d3d8',
                    20,
                    '#2099d8',
                    100,
                    '#6d60a9',
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
              this.map.addLayer({
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
              this.map.addLayer({
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
  addToggleButtons() {
    // Si las capas no se agregaron al mapa, cancelar
    if (
      !this.map.getLayer('unclustered-point') ||
      !this.map.getLayer('cluster-count') ||
      !this.map.getLayer('clusters')
    ) {
      return;
    }
    // Enumerar los ids de las capas que se pueden alternar
    const toggleableLayerIds = [
      'unclustered-point',
      'cluster-count',
      'clusters',
    ];
    // Configurar el comportamiento de visibilidad para cada capa
    for (const id of toggleableLayerIds) {
      // Verificar si la capa debe estar visible o no
      const layerVisible = this.capa;

      // Configurar la visibilidad de la capa
      if (layerVisible) {
        this.map.setLayoutProperty(id, 'visibility', 'visible');
        this.map.setLayoutProperty(id, 'visibility', 'visible');
        this.map.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        this.map.setLayoutProperty(id, 'visibility', 'none');
        this.map.setLayoutProperty(id, 'visibility', 'none');
        this.map.setLayoutProperty(id, 'visibility', 'none');
      }
    }
  }

  ngOnInit() {
    // Código de inicialización adicional si es necesario
    this.capa = this.capa;
  }
  ngOnChanges() {
    this.addToggleButtons();
    console.log('Valor de capa en el componente hijo:', this.capa);
  }
}
