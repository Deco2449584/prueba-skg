import { Component, OnInit } from '@angular/core';
import { HoverEventData } from '../models/hover.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  fechaHora: Date = new Date();
  constructor() {}

  ngOnInit(): void {
    // Actualizar la fecha y hora cada segundo (1000 milisegundos)
    setInterval(() => {
      this.fechaHora = new Date();
    }, 1000);
  }
  title = '';
  mostrarDivs1: boolean = false;
  idSeleccionado: number = 0;
  capturarValor(eventData: HoverEventData) {
    this.mostrarDivs1 = eventData.value;
    this.idSeleccionado = eventData.id;
  }
  capaBuses: boolean = true;
  mostrarValorConsola() {
    console.log(this.capaBuses);
  }
}
