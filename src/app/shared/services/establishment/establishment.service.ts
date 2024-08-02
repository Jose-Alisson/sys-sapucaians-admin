import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  private soc = io('ws://localhost:4000')

  private URL = `http://localhost:4000/establishment`
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
