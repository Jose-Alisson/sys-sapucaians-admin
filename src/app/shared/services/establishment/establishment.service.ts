import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  private soc = io(`${environment.API_MAIN_SOCKET}`, {
    transports: ['websocket']
  })

  private URL = `${environment.API_MAIN}/establishment`
  private http = inject(HttpClient)

  inf = new BehaviorSubject<any>(null)

  constructor() {
    this.soc.on('estabelecimento', (est) => {
      this.inf.next(est)
    })
  }

  getEstablishment(){
    return this.http.get<any>(`${this.URL}`)
  }

  open(){
    this.soc.emit('toggle-open-estabelecimento')
  }

  close(){
    this.soc.emit('toggle-open-estabelecimento')
  }
}
