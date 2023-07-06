// Importar los módulos y servicios necesarios//////////////////////////////////////////
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { DataService } from '../../data/data.service';
import { Geometry, Properties } from '../../models/geojson.interface';

// Decorador del componente/////////////////////////////////////////////////////////
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
// exportar la clase///////////////////////////////
export class MapComponent implements OnInit, AfterViewInit {
  private map!: mapboxgl.Map; //solo es accesible dentro de la clase donde se declara
  //variable para activar o desactivar la capa
  @Input() capa: boolean = true;
  // Inyectar el servicio DataService
  constructor(private dataService: DataService) {}
  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    // Crear una nueva instancia del objeto Map de mapboxgl
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-75.49806374151461, 5.067157286210732],
      zoom: 13,
      attributionControl: false,
      accessToken: (mapboxgl as any).accessToken || environment.mapboxToken,
    });
    // Crear una instancia del popup fuera del evento para poder acceder a ella en ambos eventos
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
    });

    // Escuchar el evento 'style.load' del mapa
    this.map.on('style.load', () => {
      //evento hover para los puntos uncluster
      this.map.on('mouseenter', 'unclustered-point', (e) => {
        // Cambiar el cursor del mouse a una forma de puntero
        this.map.getCanvas().style.cursor = 'pointer';
        // Recuperar las características (elementos) que están siendo renderizadas en el punto del mapa donde ocurrió el evento
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });

        // Verificar si se encontraron características y si la lista tiene al menos un elemento
        if (features && features.length > 0) {
          // Obtener las propiedades del primer elemento de la lista de características
          const clusterProperties = features[0].properties as {
            UBICACION: string;
            ID: string; // Se asume que hay una propiedad "ID" en las características
          };

          // Extraer los valores relevantes de las propiedades
          const clusterUbicacion = clusterProperties.UBICACION;
          const clusterID = clusterProperties.ID;

          // Configurar el contenido del popup con la información extraída
          const popupContent = `
      <div class="modalhover">
        <div class="modalburbuja">
          <div class="modalhoverid">${clusterID}</div>
          <div class="modalhoverubicacion">
            ${clusterUbicacion}
          </div>
        </div>
      </div>
    `;

          // Obtener las coordenadas lngLat del evento
          const lngLat = e.lngLat;

          // Establecer el contenido y la ubicación del popup
          popup.setLngLat(lngLat).setHTML(popupContent).addTo(this.map);

          // Obtener el tamaño del popup para calcular el desplazamiento
          const popupSize = popup.getElement()?.getBoundingClientRect();

          if (popupSize) {
            // Calcular el desplazamiento para centrar el popup sobre el punto
            const offsetX = -popupSize.width / 2;
            const offsetY = -popupSize.height;

            // Obtener las coordenadas del punto en píxeles
            const pointPixel = this.map.project(lngLat);

            // Calcular la posición ajustada del popup
            const adjustedPosition = this.map.unproject([
              pointPixel.x + offsetX,
              pointPixel.y + offsetY,
            ]);

            // Establecer la ubicación ajustada del popup
            popup.setLngLat(adjustedPosition);
          }
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

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates as mapboxgl.LngLatLike)
              .setHTML(
                `<div class="custom-popup">
  <div class="modal_paraderos_header">
    <div id="iconomodalparadero">
      <img id="imgbus" src="../../../assets/modal_paraderos/bus-stop3.svg" alt="" />
    </div>
    <div id="idmodal">
      <p><strong>ID:</strong>${properties.ID}</p>
    </div>
    <div id="ubicacionmodalparadero">
      <p>${properties.UBICACION}</p>
    </div>
  </div>
  <div class="modal_paraderos_body">
    <div class="conten_modal_paradero">
      <strong>TIPO DE PARADERO</strong>
      <img src="../../../assets/modal_paraderos/Group.svg" alt="" />
      <p>${properties.TIPO}</p>
    </div>
    <div class="conten_modal_paradero" id=content_modal_paradero>
      <strong>NO. DE RUTAS</strong>
      <img src="../../../assets/modal_paraderos/rutas1.svg" alt="" />
      <p>${properties.N_RUTAS}</p>
    </div>
    <div class="conten_modal_paradero">
      <strong>ADMINISTRADOR</strong>
      <img src="../../../assets/modal_paraderos/admin1.svg" alt="" />
      <p>${properties.ADMINISTRA}</p>
    </div>
  </div>
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
            clusterMaxZoom: 17, // Max zoom to cluster points on
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
                    5,
                    '#2099d8',
                    20,
                    '#6d60a9',
                    50,
                    '#006667',
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
                  'icon-allow-overlap': false,
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
