import { Component } from '@angular/core';
import { HoverEventData } from './models/hover.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  fechaHora: Date = new Date();
  title = '';
  mostrarDivs1: boolean = false;
  idSeleccionado: number = 0;
  capturarValor(eventData: HoverEventData) {
    this.mostrarDivs1 = eventData.value;
    this.idSeleccionado = eventData.id;
    console.log(this.mostrarDivs1);
    console.log(this.idSeleccionado);

    // Resto de la lógica para manejar el valor y el ID capturados
  }
}
