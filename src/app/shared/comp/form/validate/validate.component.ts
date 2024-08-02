import { Component, Input, InputSignal, OnInit, input } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent implements OnInit {
 
  viewAllError = input(false)

  @Input()
  control?: AbstractControl<any, any> 
  
  validatorName = input('')
  message = input('')
  
  isEntered() {
    return ((this.control?.touched || this.control?.dirty) || this.viewAllError())
  } 
  
  ngOnInit(): void {
  }

  setControl(control: AbstractControl<any, any>){
    this.control = control
  }
}
