import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input()
  public side = 'left' || 'right' 

  @Input()
  public active = false

  toogleActive() {
    this.active = !this.active
  }

  getSide() {
    return this.side
  }

  setActive(active: boolean) {
    this.active = active
  }

  @HostBinding('class.active') get activeClass() {
    return this.active;
  }
}
