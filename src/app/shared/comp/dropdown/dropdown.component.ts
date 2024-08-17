import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, input, Input, Output, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements ControlValueAccessor {





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

  protected onChange?: (value: string) => {}

  private ngControl = inject(NgControl, { optional: true })

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this
    }
  }

  sinalizar() {
    this.selectEvent.emit(this.select)
  }

  reset() {
    this.select = ''
  }

  setValue(value: string) {
    this.select = value
    this.title = value
  }

  writeValue(obj: any): void {
    this.select = obj
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.dropdownElement?.nativeElement.contains(event.target)) {
      this.active = false;
    }
  }
}
