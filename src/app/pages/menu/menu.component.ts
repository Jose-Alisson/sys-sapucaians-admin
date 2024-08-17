import { CommonModule, CurrencyPipe, ViewportScroller } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, inject, OnInit, Output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ModalComponent } from '../../shared/comp/modal/modal.component';
import { AdicionaisComponent } from '../../shared/comp/adicionais/adicionais.component';
import { min } from 'rxjs';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from "../../shared/comp/sidebar/sidebar.component";
import { CartService } from '../../shared/services/cart/cart.service';
import { Router } from '@angular/router';
import { EstablishmentService } from '../../shared/services/establishment/establishment.service';
import { ProdutoService } from '../../shared/services/produto/produto.service';
import { Amount } from '../../shared/model/amount.model';
import { category } from '../../shared/model/category.model';
import { Product } from '../../shared/model/product.model';
import { Additional } from '../../shared/model/additional.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ModalComponent, AdicionaisComponent, ReactiveFormsModule, SidebarComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Output()
  saveEvent = new EventEmitter()

  cart = inject(CartService)
  produtoService = inject(ProdutoService)
  establishmentService = inject(EstablishmentService)
  router = inject(Router)

  @ViewChild('sidebar') sidebar?: SidebarComponent
  @ViewChildren('add') add?: QueryList<AdicionaisComponent>

  observation = new FormControl('', [Validators.maxLength(255)])
  searchControl = new FormControl('')

  counter = 1

  // categorias: category[] = []

  totalCart = 0

  establishment: any

  ngOnInit(): void {
    this.produtoService.getAllToCategory().subscribe(data => {
      this.categorias = data
    })

    this.cart.total.subscribe((total) => {
      this.totalCart = total
    })

    this.establishmentService.getEstablishment().subscribe(data => {
      this.establishment = data
    })
  }

  // Adiciona ao carrinho o item desejado
  comprar(item: any) {

    let amount: Amount = {
      product: item,
      quantity: this.counter,
      additional: this.getAdditionalSelect(),
      observation: this.observation.value || '',
      id: null,
      amount: undefined
    }

    this.cart.addItemToCart(amount)
  }

  search(event: KeyboardEvent) {
    // this.produtoService.search()
    if (event.key === 'Enter') {
      this.produtoService.search(this.searchControl.value || '').subscribe(data => {
        this.searchResult = data
        this.s = this.searchControl.value || ''
      })
    }
  }

  //No modal ele diminui a quantidade do item que o cliente quer
  decrement() {
    if (this.counter > 1) {
      this.counter--
    }
  }

  //No modal ele aumenta a quantidade do item que o cliente quer
  increment() {
    if (this.counter < 9) {
      this.counter++
    }
  }

  //No modal ele aumenta retorna o price do item já com os adicionais
  getPrice(item: Product) {
    let price = item.price

    this.add?.forEach(add => {
      add.select.forEach(select => {
        price += select.price
      })
    })

    return price * this.counter
  }

  getAmountValue(amount: Amount) {
    let value = amount?.product?.price

    amount.additional?.forEach((attr: Additional) => {
      value += attr.price
    });

    return value * amount.quantity;
  }


  //No modal atual ele retona as seleçoes feitas no adicionais
  getAdditionalSelect() {
    let additionals: any[] = []

    this.add?.forEach(item => {
      additionals.push(...item.select)
    })

    return additionals
  }

  getAdditionalText(item: any) {

  }

  clean() {
    this.observation = new FormControl('')
    this.counter = 1

    this.add?.forEach(item => {
      item.desactive.desactive = false
      item.select = []
    })
  }

  getCategorysName() {
    return this.categorias.map(category => category.name)
  }

  private viewportScroller = inject(ViewportScroller)

  scrollToCategory(categoryName: string) {
    this.s = ''
    let category = document.getElementById('category-' + categoryName)
    let top = document.getElementById('top')

    let categoryB = category?.getBoundingClientRect()
    let topB = top?.getBoundingClientRect()

    this.viewportScroller.scrollToPosition([0, categoryB!.top + window.scrollY - topB!.height || 0])
  }

  isSelectInvalid(){
    let invalid = false

    this.add?.forEach(add => {
      if(add.select.length < add.additional.min){
        invalid = true
      }
    })

    return invalid
  }

  // ----------------------------------------------------------//

  getAttributeList(attrs: any) {
    return attrs?.map((attr: Additional) => attr.name)?.join(', ')
  }

  incrementAmount(amount: Amount) {
    this.cart.increment(amount)
  }

  decrementAmount(amount: Amount) {
    this.cart.decrement(amount)
  }

  salvar() {
    this.saveEvent.emit()
  }

  s = ''
  categorias: category[] = []
  searchResult: Product[] = []
}
