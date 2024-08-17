import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Order } from '../../model/order.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private URL = `http://localhost:5050`
  private http = inject(HttpClient)
  private sanitizer = inject(DomSanitizer)

  private config: any

  impressoras = new BehaviorSubject<string[]>([])
  view = new BehaviorSubject<SafeUrl>({})

  protected socket = io(`${environment.API_L}`, {
    transports: ['websocket']
  })

  constructor() {

    this.socket.on('listar-impressoras', (impressoras) => {
      this.impressoras.next(impressoras)
    })

    this.socket.on('view', (blob) => {
      const imageBlob = this.base64ToBlob(blob, 'image/png');
      const imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
      this.view.next(imageUrl)
    })

    // this.http.get(`${this.URL}/config.json`).subscribe((data : any) => {
    //   this.config = data

    //   document.getElementById("name")!.textContent = data.ClientNome 
    // })
  }

  preview(config: any, order: any){
    this.socket.emit('preview', config, order)
  }

  print(config: any, order: any){
    this.socket.emit('imprimir', config, order)
  }

  private base64ToBlob(base64: string, mime: any) {
    const bytes = atob(base64);
    const arrayBuffer = new ArrayBuffer(bytes.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mime });
  }
}
