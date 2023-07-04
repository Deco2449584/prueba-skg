import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaderosComponent } from './paraderos.component';

describe('ParaderosComponent', () => {
  let component: ParaderosComponent;
  let fixture: ComponentFixture<ParaderosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParaderosComponent]
    });
    fixture = TestBed.createComponent(ParaderosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
