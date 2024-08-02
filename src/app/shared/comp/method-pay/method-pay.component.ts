import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../modal/modal.component";
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateComponent } from "../form/validate/validate.component";
import { InputComponent } from "../form/input/input.component";

@Component({
  selector: 'app-method-pay',
  standalone: true,
  imports: [DropdownComponent, CommonModule, ModalComponent, ReactiveFormsModule, ValidateComponent, InputComponent],
  templateUrl: './method-pay.component.html',
  styleUrl: './method-pay.component.scss'
})
export class MethodPayComponent implements AfterViewInit {

  @Input()
  payment?: string

  paymentValue = new FormControl('', [Validators.required])

  @ViewChild('drop')
  drop?: DropdownComponent


  ngAfterViewInit(): void {
    if (this.payment) {
      let payment = this.payment.split(', ')
      this.drop!.select = payment[0]
      this.drop!.title = payment[0]

      this.paymentValue.setValue(payment[1])
      console.log(payment)
    }
  }

  getMethodPayment() {
    return this.drop?.select || 'Não Especificada'
  }

  reset() {
    this.drop!.active = false
    this.drop?.reset()
  }

  setValue(value: string) {
    if (this.drop) {
      this.drop.setValue(value)
    }
  }
}
