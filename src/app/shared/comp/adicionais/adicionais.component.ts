import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DesativeAdicionaisDirective } from '../../directive/desative/desative.directive';
import { Additional } from '../../model/additional.model';
import { AdditionalManager } from '../../model/additionalManager.model';

@Component({
  selector: 'app-adicionais',
  standalone: true,
  imports: [CommonModule, DesativeAdicionaisDirective],
  templateUrl: './adicionais.component.html',
  styleUrl: './adicionais.component.scss'
})
export class AdicionaisComponent {

  @Input()
  additional: AdditionalManager = {
    id: undefined,
    name: '',
    max: 0,
    min: 0,
    additional: []
  }

  select: any[] = []

  desactive =  { desactive: false }

  getSize(element: HTMLDivElement, active: boolean) {
    if (active) {
      return { '--full': element.getBoundingClientRect().height + 'px' }
    }
    return { '--full': '0px' }
  }

  active(item: any) {
    let i = this.select.findIndex((attr: any) => attr === item)
    return i != -1
  }

  desative(item: any) {
    if (this.desactive.desactive) {
      let i = this.select.findIndex((attr: any) => attr === item)
      if (i == -1) {
        return true
      }
    }
    return false
  }
}
