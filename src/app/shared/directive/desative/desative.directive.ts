import { Directive, HostListener, Input, Output, output } from '@angular/core';

@Directive({
  selector: '[desativAdicionais]',
  standalone: true
})
export class DesativeAdicionaisDirective {

  @Input() select: any
  @Input() additional: any
  @Input() max : number = 0
  @Input() desactive: any
 

  constructor() { }

  @HostListener('click', ['$event'])
  reactive(event: MouseEvent) {
    if (this.select.length < this.max) {
      let index = this.select.findIndex((attr: any) => attr === this.additional)
      if (index != -1) {
        this.select?.splice(index, 1)
      } else {
        this.select?.push(this.additional)
      }
    } else {
      let index = this.select.findIndex((attr: any) => attr === this.additional)
      if (index != -1) {
        this.select?.splice(index, 1)
      }
    }

    if (this.select.length < this.max) {
      this.desactive.desactive = false
    } else {
      this.desactive.desactive = true
    }

    console.log(this.select)
  }

}
