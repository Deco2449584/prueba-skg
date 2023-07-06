import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPopupContentComponent } from './custom-popup-content.component';

describe('CustomPopupContentComponent', () => {
  let component: CustomPopupContentComponent;
  let fixture: ComponentFixture<CustomPopupContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomPopupContentComponent]
    });
    fixture = TestBed.createComponent(CustomPopupContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
