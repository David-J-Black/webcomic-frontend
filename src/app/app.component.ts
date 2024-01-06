import {Component, HostListener, OnInit} from '@angular/core';
import {NavigationService} from "./service/navigation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
      private _navigationService: NavigationService,
  ) {}


  // The minimum width the window has to be for us to keep the side-drawer out
  isMenuOpenToggle: boolean = false;
  wideEnoughForSideMenu: boolean = false;
  private menuOutWidth: number = 800;
  private windowWidth: number | undefined;

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
    this._navigationService.goToFirstPage();
  }

  /**
   * Navigates window to Lage page in comic
   */
  goToLastPage() {
    this._navigationService.goToLastPage(0);
  }

  goToAboutPage() {
    this._navigationService.goToAboutPage();
  }

  goToExtrasPage() {
    this._navigationService.goToExtrasPage();
  }

  goToTableOfContents() {
    this._navigationService.goToTableOfContents();
  }

  goToSinglePage() {
    console.debug('Test');

    // TODO: Fix this, I would like to have this work
    // const params = this._route.snapshot.params;
    // console.log(params);
    //
    // // Access individual route parameters
    // const routeChapterNumber = params['chapter'];
    // const routePageNumber = params['page'];
    //
    // // Do something with the parameter values
    // console.log(`chapter: ${routeChapterNumber}`);
    // console.log(`page: ${routePageNumber}`);
    //
    // const chapterNumber = Number.parseInt(routeChapterNumber);
    // const pageNumber = Number.parseInt(routePageNumber);



    this._navigationService.goToSinglePage(1, 1);
  }
}
