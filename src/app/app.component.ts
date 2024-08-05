import { Component, inject } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PedidoService } from './shared/services/pedido/pedido.service';
import { CommonModule } from '@angular/common';
import { EstablishmentService } from './shared/services/establishment/establishment.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  protected API_MAIN = environment.API_MAIN

  end = ""

  router = inject(Router)
  pedidoService = inject(PedidoService)
  private establishmentService = inject(EstablishmentService)

  protected establishment: any

  constructor(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.end = event.url;
      }
    });

  
    this.establishmentService.getEstablishment().subscribe(data => {
      this.establishment = data
    })
  }

  
}
