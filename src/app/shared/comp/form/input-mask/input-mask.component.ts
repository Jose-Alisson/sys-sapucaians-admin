import { Component, input } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './input-mask.component.html',
  styleUrl: './input-mask.component.scss',
  providers: [
    provideNgxMask()
  ]
})
export class InputMaskComponent extends InputComponent {

  mask = input('')
  prefix = input('')
  dropCharacter = input(true)
  specialCharecter = input([''])

  constructor(){
    super()
  }
}
