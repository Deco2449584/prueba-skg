import { Component, Output, EventEmitter } from '@angular/core';
import { HoverEventData } from '../../models/hover.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() hoverButton = new EventEmitter<HoverEventData>();
  mostrarDivs1: boolean = false;
  idSeleccionado: number = 0;
  capturarValor(eventData: HoverEventData) {
    this.mostrarDivs1 = eventData.value;
    this.idSeleccionado = eventData.id;
    this.hoverButton.emit(eventData);
  }
}
