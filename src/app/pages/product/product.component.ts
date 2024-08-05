import { Component, inject, ViewChild } from '@angular/core';
import { ProdutoService } from '../../shared/services/produto/produto.service';
import { category } from '../../shared/model/category.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalComponent } from '../../shared/comp/modal/modal.component';
import { AdicionaisComponent } from '../../shared/comp/adicionais/adicionais.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadFileComponent } from "../../shared/comp/upload-file/upload-file.component";
import { Product } from '../../shared/model/product.model';
import { AdicionaisCreateComponent } from "../../shared/comp/adicionais-create/adicionais-create.component";
import { AdditionalManager } from '../../shared/model/additionalManager.model';
import { lastValueFrom, of } from 'rxjs';
import { FileService } from '../../shared/services/file/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EstablishmentService } from '../../shared/services/establishment/establishment.service';
import { InputComponent } from "../../shared/comp/form/input/input.component";
import { ValidateComponent } from "../../shared/comp/form/validate/validate.component";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CurrencyPipe, ModalComponent, AdicionaisComponent, ReactiveFormsModule, UploadFileComponent, CommonModule, AdicionaisCreateComponent, InputComponent, ValidateComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  protected API_MAIN = environment.API_MAIN

  @ViewChild("uploadFile")
  uploadFile?: UploadFileComponent

  @ViewChild('mCreate')
  mCreate!: ModalComponent

  product?: Product

  additional?: AdditionalManager

  categorys: category[] = []

  private productService = inject(ProdutoService)
  private form = inject(FormBuilder)
  private fileService = inject(FileService)
  private sanitizer = inject(DomSanitizer)
  private establishmentService = inject(EstablishmentService)

  protected productForm = this.form.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required]],
    category: ['', [Validators.required]],
  })

  protected page: 'view' | 'create' = 'view'

  protected addtionalForm = this.form.group({
    name: ['', [Validators.required]],
    min: [0, [Validators.required]],
    max: [0, [Validators.required]]
  })

  protected establishment: any

  protected viewAllErrors = false

  constructor() {
    this.productService.getAllToCategory().subscribe(data => {
      this.categorys = data
      console.log(data)
    })

    this.establishmentService.getEstablishment().subscribe(data => {
      this.establishment = data
    })
  }

  remover(add: AdditionalManager) {
    console.log(add)
    let i = this.product?.additional.findIndex(a => a === add) ?? -1

    if(i != -1){
      this.product?.additional.splice(i, 1)
    }
  }

  async save() {
    if (this.productForm.valid) {
      let product: Product = {
        id: undefined,
        name: this.productForm.controls.name.value || '',
        photoUrl: this.product?.photoUrl,
        description: this.productForm.controls.description.value || '',
        price: this.productForm.controls.price.value || 0,
        category: this.productForm.controls.category.value || '',
        additional: this.product?.additional || []
      }

      if (this.uploadFile?.isSelected()) {
        let f = await lastValueFrom(this.uploadFile?.upload() ?? of())
        product.photoUrl = f?.['filename']
      }

      if (this.product?.id) {
        this.productService.update(this.product.id, product).subscribe((data) => {
          let category = this.categorys.find(c => c.name === data.category)

          if (data.photoUrl) {
            this.fileService.download(data.photoUrl).subscribe(blob => {
              data.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
            })
          }

          if (category) {
            let index = category.products.findIndex(p => p.id === data.id)
            if (index != -1) {
              category.products[index] = data
            } else {
              category.products.push(data)
            }
          } else {
            this.categorys.push({
              name: data.category || '',
              products: [data]
            })
          }

          this.page = 'view'
        })
      } else {
        this.productService.create(product).subscribe(data => {
          let category = this.categorys.find(c => c.name === data.category)

          if (data.photoUrl) {
            this.fileService.download(data.photoUrl).subscribe(blob => {
              data.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
            })
          }

          if (category) {
            let index = category.products.findIndex(p => p.id === data.id)
            if (index != -1) {
              category.products[index] = data
            } else {
              category.products.push(data)
            }
          } else {
            this.categorys.push({
              name: data.category || '',
              products: [data]
            })
          }
          this.page = 'view'
        })
      }
    } else {
      console.log(this.productForm)
      this.viewAllErrors = true
    }
  }

  clean() {
    this.product = undefined

    this.productForm = this.form.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required]],
      category: ['', [Validators.required]],
    })

    this.addtionalForm = this.form.group({
      name: ['', [Validators.required]],
      min: [0, [Validators.required]],
      max: [0, [Validators.required]]
    })
  }

  addAditionalToProduct() {
    let addtional: AdditionalManager = {
      id: undefined,
      name: this.addtionalForm.controls.name.value || '',
      max: this.addtionalForm.controls.max.value || 0,
      min: this.addtionalForm.controls.min.value || 0,
      additional: []
    }
    this.product?.additional.push(addtional)

    this.mCreate.active = false
  }

  loadProduct(product: Product) {
    this.product = { ...product }
    this.page = 'create'
    this.productForm.setValue({
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      category: this.product.category || ''
    })
  }
}
