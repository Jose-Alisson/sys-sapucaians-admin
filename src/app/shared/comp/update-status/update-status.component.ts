import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Order } from '../../model/order.model';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './update-status.component.html',
  styleUrl: './update-status.component.scss'
})
export class UpdateStatusComponent extends DropdownComponent{

  @Output()
  statusEvent = new EventEmitter<string>()

  execute(){
    this.statusEvent.emit(this.select)
  }
}
