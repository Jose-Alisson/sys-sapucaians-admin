import { AfterViewChecked, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SidebarComponent } from "../../shared/comp/sidebar/sidebar.component";
import { Order } from '../../shared/model/order.model';
import { PedidoService } from '../../shared/services/pedido/pedido.service';
import { DropdownComponent } from "../../shared/comp/dropdown/dropdown.component";
import { CommonModule, JsonPipe } from '@angular/common';
import { Product } from '../../shared/model/product.model';
import { MethodPayComponent } from "../../shared/comp/method-pay/method-pay.component";
import { MethodDeliveryComponent } from "../../shared/comp/method-delivery/method-delivery.component";
import { Amount } from '../../shared/model/amount.model';
import { Additional } from '../../shared/model/additional.model';
import { PrinterService } from '../../shared/services/printer/printer.service';
import { DropdownSliderComponent } from "../../shared/comp/dropdown-slider/dropdown-slider.component";
import { MenuComponent } from "../menu/menu.component";
import { CartService } from '../../shared/services/cart/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateStatusComponent } from "../../shared/comp/update-status/update-status.component";
import { ButtonPrinterComponent } from "../../shared/comp/button-printer/button-printer.component";
import { InputMaskComponent } from "../../shared/comp/form/input-mask/input-mask.component";
import { ValidateComponent } from "../../shared/comp/form/validate/validate.component";
import { InputComponent } from '../../shared/comp/form/input/input.component';
import { ModalComponent } from "../../shared/comp/modal/modal.component";
import { PrinterComponent } from "../../shared/comp/printer/printer.component";

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [SidebarComponent, DropdownComponent, JsonPipe, CommonModule, MethodPayComponent, MethodDeliveryComponent, DropdownSliderComponent, MenuComponent, ReactiveFormsModule, UpdateStatusComponent, ButtonPrinterComponent, InputComponent, ValidateComponent, ModalComponent, PrinterComponent],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent {

  @ViewChild('sidebar')
  sidebar!: SidebarComponent

  @ViewChild('mtdPay')
  mtdPay!: MethodPayComponent

  @ViewChild('mtdDelivery')
  mtdDelivery!: MethodDeliveryComponent

  private pedidoService = inject(PedidoService)
  private printerService = inject(PrinterService)
  public cartService = inject(CartService)

  form = inject(FormBuilder)
  clienteForm = this.form.group({
    name: [''],
    cellPhone: ['']
  })

  total = 0

  order?: Order
  // orders: Order[] = []

  viewMenu = false

  impressoras: string[] = []

  dates: string[] = []
  date?: string

  constructor() {
    this.cartService.total.subscribe((total) => {
      this.total = total
    })

    this.printerService.impressoras.subscribe(data => {
      this.impressoras = data
    })

    this.pedidoService.getDates().subscribe(data => {
      this.dates = data.sort((a: any, b: any) => {
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateB - dateA;
      });
    })

    this.printerService.impressoras.subscribe(data => {
      this.impressoras = data
    })
  }

  getDate() {
    if (this.date) {
      let d = this.date.split('-')
      return `${d[2]}-${d[1]}-${d[0]}`.replaceAll('-', '/')
    } else {
      let d = this.pedidoService.currentDate.split('-')
      if (d.length > 1) {
        return `${d[2]}-${d[1]}-${d[0]}`.replaceAll('-', '/')
      }
      return ''
    }
  }

  preview(order: Order) {
    this.pedidoService.preview(order)
  }

  isNew(order: Order) {
    return this.pedidoService.newOrders.some(o => o.id === order.id)
  }

  counterNewByDate(date: string){
    return this.pedidoService.newOrders.reduce((counter, order) => order.dateCreation.split('T')[0] === date ? counter + 1 : counter, 0)
  }

  getOrdersByStatus(status: string) {
    let orders = this.pedidoService.orders.filter(order => order.status === status).sort((a, b) => (new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()))
    return orders.length > 0 ? orders : undefined
  }

  getPrice(order: Order) {
    let total = 0
    order.amounts?.forEach(add => {
      let price = add.product.price
      add?.additional?.forEach(select => {
        price += select.price
      })
      price *= add.quantity
      total += price
    })
    return total
  }

  increment(amount: Amount) {
    this.cartService.increment(amount)
  }

  decrement(amount: Amount) {
    this.cartService.decrement(amount)
  }

  getAmountValue(amount: Amount) {
    let value = amount?.product.price
    amount?.additional?.forEach((attr: Additional) => {
      value += attr.price
    });
    return value * amount?.quantity;
  }

  setTotal(order: Order) {
    let total = 0
    order.amounts?.forEach(amount => {
      total += this.getAmountValue(amount)
    })
    this.total = total
  }

  getAttributeList(attrs: any) {
    return attrs?.map((attr: Additional) => attr.name)?.join(', ')
  }

  delete(amount: Amount) {
    this.cartService.removeItemToCart(amount)
  }

  loadOrder(order: Order) {
    this.viewMenu = false
    this.order = order
    this.cartService.setItemsToCart(order.amounts || [])
    this.clienteForm.setValue({
      name: this.order.name,
      cellPhone: this.order.cellPhone
    })

    this.mtdDelivery?.setAddress(order.address)
    this.mtdPay?.setValue(order.payment)

    this.preview(order)
  }

  loadOrdersByDate(date: string) {
    this.pedidoService.loadOrdersByDate(date)
  }

  create() {

    let pedido: Order = {
      name: this.clienteForm.controls.name.value || 'Não identificado',
      cellPhone: this.clienteForm.controls.cellPhone.value || '',
      amounts: this.cartService.getCart().getValue(),
      payment: this.mtdPay.getMethodPayment(),
      address: this.mtdDelivery.getMethodDelivery(),
      id: 0,
      dateCreation: '',
      status: undefined
    }
    this.pedidoService.create(pedido).subscribe(data => {
      this.clean()
      this.order = undefined
    })
  }

 

    
//     if (this.order) {

//       let date = new Date(this.order.dateCreation)

//       const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//       const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: true }).slice(0, 5);
//       let page =
//         `
// # Pizzaria Sapucaian's
// Hora: 
// ${formattedDate} - ${formattedTime}
// ID do pedido: ${this.order.id}
// Nome do cliente: ${this.order.name}
// ___
// Telefone: ${this.order.cellPhone}
// Endereço: ${this.order.address}
// ___
// Produtos:
// ${this.getProductPage()}
// Forma de pagamaento: ${this.order.payment}
// ___
// Total:
// ${this.getPrice(this.order).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
// `
//       this.printerService.printer(name, page)
//     }

  // private getProductPage() {
  //   let products = ''

  //   this.order?.amounts?.forEach((amount: Amount) => {
  //     let total = amount.product.price
  //     let additionals = ''

  //     amount.additional?.forEach(additional => {
  //       total += additional.price
  //       additionals += ' ' + additional.name + '\n'
  //     })

  //     let product = `x${amount.quantity} ${amount.product.name} ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`
  //     product += additionals
  //     products += product
  //   })
  //   return products
  // }

  clean() {

    this.order = {
      id: undefined,
      dateCreation: '',
      name: '',
      cellPhone: '',
      amounts: [],
      payment: '',
      address: '',
      status: '',
      numPrint: 0
    }

    this.mtdDelivery?.reset()
    this.mtdPay?.reset()
    this.cartService.setItemsToCart(this.order.amounts || [])
    this.clienteForm = this.form.group({
      name: ['', [Validators.required]],
      cellPhone: ['', [Validators.required]]
    })

    this.sidebar.active = false
    this.viewMenu = true
  }


  updateStatus(status: string) {
    if (this.order) {
      let s = ''
      switch (status) {
        case 'CRIADO':
          s = 'CREATED'
          break;
        case 'PREPARANDO':
          s = 'PREPARING'
          break;
        case 'FINALIZADO':
          s = 'FINISHED'
          break;
        case 'CANCELADO':
          s = 'CANCELED'
          break;
        default:
          s = this.order.status || 'CREATED'
          break;
      }
      this.order.status = s

      this.order.name = this.clienteForm.controls.name.value || 'Não identificado';
      this.order.cellPhone = this.clienteForm.controls.cellPhone.value || ''
      this.order.payment = this.mtdPay.getMethodPayment()
      this.order.address = this.mtdDelivery.getMethodDelivery()

      this.pedidoService.update(this.order?.id || 0, this.order).subscribe(data => {
        this.clean()
        this.order = undefined
      })
    }
  }
}
