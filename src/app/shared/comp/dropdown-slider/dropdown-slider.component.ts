import { Component } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-slider.component.html',
  styleUrl: './dropdown-slider.component.scss'
})
export class DropdownSliderComponent extends DropdownComponent{
  getSize(element: HTMLDivElement, active: boolean) {
    if (active) {
      return { '--full': element.getBoundingClientRect().height + 'px' }
    }
    return { '--full': '0px' }
  }
}
