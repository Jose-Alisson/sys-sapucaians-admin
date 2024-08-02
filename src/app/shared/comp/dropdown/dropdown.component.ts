import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, input, Input, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @ViewChild('dropdown') dropdownElement?: ElementRef;
  
  @Input()
  title = ''

  @Input()
  active = false

  @Output()
  selectEvent = new EventEmitter<string>()

  select = ''

  @Input()
  options: string[] = []

  sinalizar(){
    this.selectEvent.emit(this.select)
  }

  reset(){
    this.select = ''
  }

  setValue(value: string){
    this.select = value
    this.title = value
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.dropdownElement?.nativeElement.contains(event.target)) {
      this.active = false;
    }
  }
}
