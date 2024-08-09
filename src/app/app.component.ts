import { Component, Inject, inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PedidoService } from './shared/services/pedido/pedido.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EstablishmentService } from './shared/services/establishment/establishment.service';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  protected API_MAIN = environment.API_MAIN

  end = ""

  router = inject(Router)
  pedidoService = inject(PedidoService)
  private establishmentService = inject(EstablishmentService)
  private title = inject(Title)

  protected establishment: any

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.end = event.url;
      }
    });

    this.establishmentService.getEstablishment().subscribe(data => {
      this.establishment = data
      this.title.setTitle(`${data.ClientNome} | Admin`)
    })
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const head = document.head;
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'href', 'http://localhost/main/style.css');
      this.renderer.appendChild(head, link);
    }
  }
}
