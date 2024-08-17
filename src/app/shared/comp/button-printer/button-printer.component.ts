import { Component, EventEmitter, inject, Input, Output, ViewChild, viewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../modal/modal.component";
import { PrinterComponent } from "../printer/printer.component";
import { Order } from '../../model/order.model';
import { PrinterService } from '../../services/printer/printer.service';

@Component({
  selector: 'app-button-printer',
  standalone: true,
  imports: [CommonModule, ModalComponent, PrinterComponent],
  templateUrl: './button-printer.component.html',
  styleUrl: './button-printer.component.scss'
})
export class ButtonPrinterComponent extends DropdownComponent {

  @ViewChild('printer')
  printer?: PrinterComponent

  private print = inject(PrinterService)

  @Input()
  order?: Order

  @Output()
  printEvent = new EventEmitter<string>()

  execute() {
    if (this.printer) {

      let config = this.printer.getConfig()
      config.printer = this.select

      this.print.print(config, this.order)
    } else {
      console.log('Não foi possivel visualizar')
    }
  }
}
