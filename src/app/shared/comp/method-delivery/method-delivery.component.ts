import { Component, computed, effect, inject, Input, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-method-delivery',
  standalone: true,
  imports: [DropdownComponent, CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './method-delivery.component.html',
  styleUrl: './method-delivery.component.scss'
})
export class MethodDeliveryComponent {

  @ViewChild('modalEndereco')
  modalEnd!: ModalComponent

  @ViewChild('drop')
  drop?: DropdownComponent

  form = inject(FormBuilder)

  addressForm = this.form.group({
    rua: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    complemento: ['']
  })

  @Input({ transform: convertStringToAddress })
  address: any

  constructor() {
  }

  openModal(valor: string) {
    if (valor === 'Loja') {
      this.address = undefined
    }
    if (valor === 'Delivery') {
      this.modalEnd.active = true
      console.log('Endereço')
    }
  }

  concluirEndereco() {
    this.address = { ...this.addressForm.value }
    this.addressForm.reset()
    this.modalEnd.active = false
  }

  getMethodDelivery() {
    if (this.address) {
      let rua = this.address.rua
      let numero = this.address.numero
      let complemento = this.address.complemento
      let address = [rua, numero, complemento].filter(item => item != null && item != undefined).join(', ')
      return address
    }
    return 'Loja'
  }

  reset() {
    this.drop!.active = false
    this.drop?.reset()
    this.address = undefined
  }

  setAddress(address: string) {
    let add = address.split(",")

    this.address = {
      rua: add[0],
      numero: add[1],
      complemento: add[2]
    }
  }
}

function convertStringToAddress(data: string) {
  let add = data.split(",")

  let address = {
    rua: add[0],
    numero: add[1],
    complemento: add[2]
  }
  return address
}