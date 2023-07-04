import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { DataService } from '../../data/data.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  showData: boolean = true;
  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-75.49806374151461, 5.067157286210732],
      zoom: 9,
      attributionControl: false,
      accessToken: (mapboxgl as any).accessToken || environment.mapboxToken,
    });

    map.on('style.load', () => {
      map.addControl(new mapboxgl.NavigationControl());

      this.dataService.getDatosFromAPI().subscribe((data: any) => {
        // Procesar los datos recibidos y agregarlos al mapa
        if (data && data.features) {
          map.addSource('datos', {
            type: 'geojson',
            data: data,
          });

          const image = new Image();
          image.src = '../../../assets/img/map-bus-stop.png';
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            context?.drawImage(image, 0, 0);
            const imageData = context?.getImageData(
              0,
              0,
              image.width,
              image.height
            );

            if (imageData) {
              map.addImage('bus-stop-icon', imageData);

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
