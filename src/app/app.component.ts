import {Component, HostListener} from '@angular/core';
import {WindowService} from "./service/window.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private scrollPositionService: WindowService) {}

  title = 'Finding Darwin';

  @HostListener('window: scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    this.scrollPositionService.setScrollPosition(scrollY);
  }


}
