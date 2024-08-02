import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSliderComponent } from './dropdown-slider.component';

describe('DropdownSliderComponent', () => {
  let component: DropdownSliderComponent;
  let fixture: ComponentFixture<DropdownSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
