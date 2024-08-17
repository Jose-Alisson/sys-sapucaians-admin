import { AfterContentInit, AfterViewInit, Component, ContentChildren, inject, Input, input, OnInit, Optional, QueryList, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { ValidateComponent } from '../validate/validate.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InputComponent implements ControlValueAccessor, AfterContentInit {

  @ContentChildren(ValidateComponent) children?: QueryList<ValidateComponent>;

  @Input({ required: true })
  title: string = ''

  value = ''

  protected onChange?: (value: string) => {}
  protected OnTouched?: () => {}

  private ngControl = inject(NgControl, { optional: true })

  protected name = ""

  type = input('text')

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this
    }
  }

  ngAfterContentInit(): void {
    this.name = 'input-' + this.title.replaceAll(' ', '')
    this.children?.forEach(validate => {
      let control = this.ngControl?.control
      if (control && (validate.control === undefined || validate.control === null) ) {
        validate.setControl(control)
      }
    })
  }

  writeValue(obj: any): void {
    this.value = obj
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.OnTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
