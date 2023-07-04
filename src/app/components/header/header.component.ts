import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() fechaHoraInput: Date;
  constructor() {
    this.fechaHoraInput = new Date(); // Inicialización de la propiedad fechaHoraInput
  }
}
