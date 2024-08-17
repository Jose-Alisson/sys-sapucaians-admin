import { Component, ElementRef, EventEmitter, inject, Output, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { InputComponent } from "../form/input/input.component";
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { PrinterService } from '../../services/printer/printer.service';

@Component({
  selector: 'app-printer',
  standalone: true,
  imports: [DropdownComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './printer.component.html',
  styleUrl: './printer.component.scss'
})
export class PrinterComponent {

  @ViewChild('label')
  private cnv?: ElementRef<HTMLCanvasElement>

  private renderer = inject(Renderer2)
  private platformId = inject(PLATFORM_ID)
  private communication = inject(PrinterService)

  private form = inject(FormBuilder)

  protected impressoras: string[] = []
  protected currentDate = ''
  protected order: any
  protected view?: SafeUrl

  protected config = this.form.group({
    printer: ['', Validators.required],
    width: [58, Validators.required],
    height: [210, Validators.required]
  })

  @Output()
  cancelEvent = new EventEmitter<any>()

  constructor() {
    this.communication.impressoras.subscribe(data => {
      this.impressoras = data
    })

    this.communication.view.subscribe(safe => {
      this.view = safe
      this.clear()
    })

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (this.cnv && this.cnv.nativeElement) {
          if(!this.view)
          this.drawText('Gerando Cupom')
        }
      });
    });

    // Configura o observer para observar mudanças na árvore de nós
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
 
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const head = document.head;
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.setAttribute(link, 'href', 'http://localhost:4040/style.css');
      this.renderer.appendChild(head, link);
    }
  }

  getPrice(order: any) {
    let total = 0
    order.amounts?.forEach((add: { product: { price: any; }; additional: any[]; quantity: number; }) => {
      let price = add.product.price
      add?.additional?.forEach(select => {
        price += select.price
      })
      price *= add.quantity
      total += price
    })
    return total
  }

  preview(order: any) {
    this.view = undefined
    this.communication.preview(this.config.value, order)
  }

  print() {
    this.drawText('Imprimindo')
    this.communication.print(this.config.value, this.order)
  }

  public loadOrder(order: any) {
    this.order = order
  }

  cancel() {
    this.order = undefined
    this.cancelEvent.emit()
  }

  private drawText(text: string) {
    let canvas = this.cnv?.nativeElement
    let ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      ctx.imageSmoothingEnabled = true;
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calcular a largura do texto
      const textWidth = ctx.measureText(text).width;
      const textHeight = 30; // Altura aproximada do texto baseada no tamanho da fonte

      // Definir as coordenadas do texto
      const x = canvas.width / 2;
      const y = canvas.height / 2;

      // Desenhar o fundo preto apenas atrás do texto
      ctx.fillStyle = 'black';
      ctx.fillRect(0, y - textHeight / 2, canvas.width, textHeight);

      // Desenhar o texto branco sobre o fundo preto
      ctx.fillStyle = 'white';
      ctx.fillText(text, x, y);
    }
  }

  private clear() {
    let canvas = this.cnv?.nativeElement
    let ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  getConfig(){
    return this.config.value
  }
}
