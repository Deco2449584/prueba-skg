import { Component, Output, EventEmitter } from '@angular/core';
import { HoverEventData } from '../../models/hover.interface';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {
  @Output() hoverButton = new EventEmitter<HoverEventData>();
  mostrarDivs1: boolean = false;
  items: any[]; // Define la propiedad 'items' como un arreglo de cualquier tipo o reemplázalo con el tipo adecuado
  constructor() {
    // Inicializa la propiedad 'items' con los datos que deseas mostrar en los elementos de las tarjetas
    this.items = [
      { id: 1, iconFileName: 'icono1' },
      { id: 2, iconFileName: 'icono2' },
      { id: 3, iconFileName: 'icono3' },
      { id: 4, iconFileName: 'icono4' },
      { id: 5, iconFileName: 'icono5' },
    ];
  }
  hoverButtonEvent(id: number) {
    if (id === -1) {
      // El mouse ha salido de todas las tarjetas
      // Realiza las acciones necesarias
    } else {
      const eventData: HoverEventData = {
        value: !this.mostrarDivs1,
        id: id,
      };

      this.mostrarDivs1 = eventData.value;
      this.hoverButton.emit(eventData);
    }
  }
}
