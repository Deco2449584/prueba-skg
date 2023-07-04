import { Component } from '@angular/core';
import { HoverEventData } from '../models/hover.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  fechaHora: Date = new Date();
  title = '';
  mostrarDivs1: boolean = false;
  idSeleccionado: number = 0;
  capturarValor(eventData: HoverEventData) {
    this.mostrarDivs1 = eventData.value;
    this.idSeleccionado = eventData.id;

    // Resto de la lógica para manejar el valor y el ID capturados
  }
}
