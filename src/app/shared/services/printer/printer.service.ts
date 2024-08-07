import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Order } from '../../model/order.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private socket = io(`${environment.API_MAIN_SOCKET}`, {
    transports: ['websocket']
  });
  
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
