import { computed, effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amount } from '../../model/amount.model';
import { Additional } from '../../model/additional.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Amount[]>([])

  total = new BehaviorSubject<number>(0)

  constructor() {
    this.cart.subscribe((cart) => {
      let total = 0
      cart.forEach((amount) => {
        let price = amount.product?.price || 0

        if (amount?.additional) {
          amount?.additional?.forEach((item: Additional) => {
            price += item.price
          })
        }

        price *= amount?.quantity || 0
        total += price
      })

      this.total.next(total)
    })
  }

  getCart() {
    return this.cart
  }

  addItemToCart(item: Amount) {
    this.cart.getValue().push(item)
    this.cart.next(this.cart.getValue())
  }

  setItemsToCart(items: Amount[]){
    this.cart.next(items)
  }

  addAllToCart(items: Amount[]){
    this.cart.getValue().push(...items)
    this.cart.next(this.cart.getValue())
  }

  removeItemToCart(item: Amount) {
    let index = this.cart.getValue().findIndex(i => i === item)
    if (index != -1) {
      this.cart.getValue().splice(index, 1)
      this.cart.next(this.cart.getValue())
    }
  }

  increment(item: Amount) {
    let index = this.cart.getValue().findIndex(i => i === item)

    if (index != -1) {
      if (item?.quantity < 10) {
        item.quantity++
      }
      this.cart.next(this.cart.getValue())
    }
  }

  decrement(item: Amount) {
    let index = this.cart.getValue().findIndex(i => i === item)

    if (index != -1) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeItemToCart(item)
      }
      this.cart.next(this.cart.getValue())
    }
  }
}
