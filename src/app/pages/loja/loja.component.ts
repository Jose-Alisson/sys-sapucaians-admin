import { Component, inject } from '@angular/core';
import { EstablishmentService } from '../../shared/services/establishment/establishment.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from "../../shared/comp/form/input/input.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidateComponent } from "../../shared/comp/form/validate/validate.component";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, ValidateComponent],
  templateUrl: './loja.component.html',
  styleUrl: './loja.component.scss'
})
export class LojaComponent {

  protected API_MAIN = environment.API_MAIN

  private form = inject(FormBuilder)

  private establishmentService = inject(EstablishmentService)
  establishment: any

  constructor(){
    this.establishmentService.getEstablishment().subscribe(data => {
      this.establishment = data
    })

    this.establishmentService.inf.subscribe(data => {
      this.establishment = data
    })
  }

  close(){
    this.establishmentService.close()
  }

  open(){
    this.establishmentService.open()
  }
}
