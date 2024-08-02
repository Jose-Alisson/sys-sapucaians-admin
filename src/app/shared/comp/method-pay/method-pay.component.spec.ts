import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodPayComponent } from './method-pay.component';

describe('MethodPayComponent', () => {
  let component: MethodPayComponent;
  let fixture: ComponentFixture<MethodPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MethodPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
