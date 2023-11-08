import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationService} from "./service/navigation.service";
import {PageService} from "./service/page.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _navigationService: NavigationService,
              private _pageService: PageService) {}

  // The minimum width the window has to be for us to keep the side-drawer out
  isMenuOpenToggle: boolean = false;
  wideEnoughForSideMenu: boolean = false;
  private menuOutWidth: number = 800;
  private windowWidth: number;

  ngOnInit() {
    // Initialize the window width
    this.processWindowWidth();
  }

  toggleMenu() {
    this.isMenuOpenToggle = !this.isMenuOpenToggle;
  }

  @HostListener('window: resize', [])
  onResize() {
    this.processWindowWidth();
  }

  /**
   *  Run this to evaluate and adjust details based on if the window is out or not.
   */
  private processWindowWidth() {
    this.windowWidth = window.innerWidth;
    this.wideEnoughForSideMenu = this.windowWidth >= this.menuOutWidth;
  }

  /**
   * This function is used to determine if the sidebar should stay out
   * This is based on screen width.
   */
  drawerIsOpen(): boolean {
    return this.isMenuOpenToggle || this.wideEnoughForSideMenu;
  }

  /**
   * Determine if the gray filter that blurs the page while
   * a window is being displayed be turned on?
   */
  grayOutVisible(): boolean {
    return this.isMenuOpenToggle && !this.wideEnoughForSideMenu;
  }

  hideDrawer(): void {
    this.isMenuOpenToggle = false;
  }

  /**
   * Navigates window to first page in comic
   */
  goToFirstPage() {
    this._pageService.goToFirstPage();
  }

  /**
   * Navigates window to Lage page in comic
   */
  goToLastPage() {
    this._pageService.goToLastPage();
  }

  goToAboutPage() {
    this._navigationService.goToAboutPage();
  }
}
