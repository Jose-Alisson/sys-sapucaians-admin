import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Order } from '../../model/order.model';
import { FileService } from '../file/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private URL = `${environment.API_PEDIDOS}order`
  private http = inject(HttpClient)

  private socket = io(`${environment.API_MAIN_SOCKET}`, {
    transports: ['websocket']
  });

  private fileService = inject(FileService)
  private sanitizer = inject(DomSanitizer)

  orders: Order[] = []
  newOrders: Order[] = []

  constructor() {
    this.socket.on('new-orders', (newOrders) => {
      this.newOrders = newOrders
    })

    this.socket.on('orders', (orders: Order[]) => {
      this.orders = orders

      orders.forEach(o => {
        o.amounts?.forEach(a => {
          if(a.product.photoUrl){
            this.fileService.download(a.product.photoUrl).subscribe(data => {
              a.product.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
            })
          }
        })
      })
    })
  }

  create(pedido: any){
    return this.http.post<any>(`${this.URL}/create`, pedido)
  }

  update(id: number, pedido: any){
    return this.http.put<any>(`${this.URL}/${id}/update`, pedido)
  }

  getDates(){
    return this.http.get<string[]>(`${this.URL}/dates`)
  }

  // wsGetOrders(){
  //   let observable = new Observable<Order[]>(observer => {
  //     let i = io('http://localhost:4000')

  //     i.on('orders', (d) => {
  //       observer.next(d)
  //     })

  //     return () => { this.socket.disconnect(); }
  //   })

  //   return observable
  // }

  preview(order: Order){
    this.socket.emit('remover-new-order', order.id)
  }

  loadOrdersByDate(date: string){
    this.socket.emit('carregar-por-data', date)
  }
}
