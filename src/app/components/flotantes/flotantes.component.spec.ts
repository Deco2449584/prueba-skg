import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotantesComponent } from './flotantes.component';

describe('FlotantesComponent', () => {
  let component: FlotantesComponent;
  let fixture: ComponentFixture<FlotantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlotantesComponent]
    });
    fixture = TestBed.createComponent(FlotantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
