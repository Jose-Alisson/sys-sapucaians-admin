import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodDeliveryComponent } from './method-delivery.component';

describe('MethodDeliveryComponent', () => {
  let component: MethodDeliveryComponent;
  let fixture: ComponentFixture<MethodDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MethodDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
