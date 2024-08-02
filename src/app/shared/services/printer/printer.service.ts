import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Order } from '../../model/order.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private socket = io('http://localhost:4000');
  
  impressoras = new BehaviorSubject<string[]>([])

  constructor() {
    this.socket.on('add-impressoras', (nomes) => {
      this.impressoras.next(nomes)
    })
  }

  printer(nome: string, text: string) {
    this.socket.emit('imprimir', nome, text)
  }

  listPrinter(){
    this.socket.emit('lista-impressoras')
  }
}
