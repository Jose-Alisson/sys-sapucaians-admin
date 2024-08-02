import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionaisCreateComponent } from './adicionais-create.component';

describe('AdicionaisCreateComponent', () => {
  let component: AdicionaisCreateComponent;
  let fixture: ComponentFixture<AdicionaisCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionaisCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdicionaisCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
