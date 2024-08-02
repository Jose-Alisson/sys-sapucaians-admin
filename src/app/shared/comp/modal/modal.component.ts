import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Output()
  closeEvent = new EventEmitter()

  @Input()
  active = false

  @Input()
  title = ''

  close(){
    this.active = false
    this.closeEvent.emit()
  }

  @HostBinding('class.active') get activeClass() {
    return this.active;
  }
}
