import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPrinterComponent } from './button-printer.component';

describe('ButtonPrinterComponent', () => {
  let component: ButtonPrinterComponent;
  let fixture: ComponentFixture<ButtonPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrinterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
