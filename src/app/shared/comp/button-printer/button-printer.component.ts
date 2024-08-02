import { Component, EventEmitter, Output } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-printer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-printer.component.html',
  styleUrl: './button-printer.component.scss'
})
export class ButtonPrinterComponent extends DropdownComponent {

  @Output()
  printEvent = new EventEmitter<string>()

  execute() {
    this.printEvent.emit(this.select)
  }
}
