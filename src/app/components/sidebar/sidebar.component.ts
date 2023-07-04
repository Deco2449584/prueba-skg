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

  showLayer(layerName: string) {
    console.log(layerName);
  }
  hoverButtonEvent(id: number) {
    const eventData: HoverEventData = {
      value: !this.mostrarDivs1,
      id: id,
    };

    this.mostrarDivs1 = eventData.value;
    this.hoverButton.emit(eventData);
  }
}
