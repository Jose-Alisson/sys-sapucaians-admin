import { AfterContentInit, Component, EventEmitter, inject, Output, viewChild, ViewChild } from '@angular/core';
import { AdicionaisComponent } from '../adicionais/adicionais.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";
import { Additional } from '../../model/additional.model';
import { AdditionalManager } from '../../model/additionalManager.model';
import { InputComponent } from "../form/input/input.component";
import { ValidateComponent } from "../form/validate/validate.component";
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-adicionais-create',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule, InputComponent, ValidateComponent],
  templateUrl: './adicionais-create.component.html',
  styleUrl: './adicionais-create.component.scss'
})
export class AdicionaisCreateComponent extends AdicionaisComponent implements AfterContentInit {

  @Output()
  removerEvent = new EventEmitter<AdditionalManager>()

  private adicional?: Additional

  @ViewChild('mEditAddManager')
  mEditAddManager!: ModalComponent

  @ViewChild('mCreate')
  mCreate?: ModalComponent

  @ViewChild('mEdit')
  mEdit?: ModalComponent

  private form = inject(FormBuilder)

  protected addManagerForm = this.form.group({
    name: ['', [Validators.required]],
    min: [0, [Validators.required]],
    max: [0, [Validators.required], [maxListSizeValidator(this.getList.bind(this))]]
  }, { validators: minMaxValidator('min', 'max') })

  protected additionalForm = this.form.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required]]
  })

  ngAfterContentInit(): void {
  }

  getList(){
    return of(this.additional.additional)
  }

  loadEditAddManager() {
    this.addManagerForm.setValue({
      name: this.additional.name,
      min: this.additional.min,
      max: this.additional.max
    })

    this.mEditAddManager.active = true
  }

  add(){
    let add: Additional = {
      id: undefined,
      name: this.additionalForm.controls.name.value || '',
      price: this.additionalForm.controls.price.value || 0
    }

    this.additional.additional?.push(add)
  }

  save() {
    let add: Additional = {
      id: this.additional.id,
      name: this.additionalForm.controls.name.value || '',
      price: this.additionalForm.controls.price.value || 0
    }

    let index = this.additional.additional?.findIndex(a => (a === (this.adicional || add)) || (a.id === add.id))

    if (index != -1) {
      this.additional.additional[index] = add
    } else {
      this.additional.additional?.push(add)
    }

    if (this.mEdit) {
      this.mEdit.active = false
    }

    if (this.mCreate) {
      this.mCreate.active = false
    }
  }

  saveAdicionalManager() {
    this.additional.name = this.addManagerForm.controls.name.value || ''
    this.additional.min = this.addManagerForm.controls.min.value || 0
    this.additional.max = this.addManagerForm.controls.max.value || 0

    this.mEditAddManager.active = false
  }

  loadAdicional(adicional: Additional) {
    this.adicional = adicional
    this.additionalForm.setValue({
      name: adicional.name || '',
      price: adicional.price || 0
    })
    if (this.mEdit) {
      this.mEdit.active = true
    }
  }

  clean() {
    this.adicional = undefined
    this.additionalForm = this.form.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required]]
    })
  }

  removerAdicional() {
    let index = this.additional.additional?.findIndex(a => a === this.adicional)
    if (index != -1) {
      this.additional.additional?.splice(index, 1)
      if (this.mEdit) {
        this.mEdit.active = false
      }
    }
  }

  remover(){
    this.removerEvent.emit(this.additional)
    this.mEditAddManager.active = false
  }
}

export function maxListSizeValidator(getList: () => Observable<any[]>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return getList().pipe(
      map(list => {
        const controlValue = control.value;

        if (controlValue !== null && controlValue > list.length) {
          return { maxListSizeError: true };
        }

        return null;
      })
    );
  };
}

function minMaxValidator(minControlName: string, maxControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const minControl = formGroup.get(minControlName);
    const maxControl = formGroup.get(maxControlName);

    if (!minControl || !maxControl) {
      return null;  // Controle não encontrado, retorne null
    }

    const minValue = minControl.value;
    const maxValue = maxControl.value;

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      return { minMaxError: true };
    }

    return null;
  };
}

