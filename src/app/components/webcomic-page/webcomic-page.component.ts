import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PageService} from "../../service/page.service";
import {WindowService} from "../../service/window.service";
import {ComicChapter, ComicPage} from "../../objects/ComicChapter";

enum ReadStyle {
  singleChapter = 'singleChapter',
  singleInfinite = 'singleInfinite',
  spreadChapter = 'spreadChapter',
  spreadInfinite = 'spreadInfinite'
}

@Component({
  selector: 'app-webcomic-page',
  templateUrl: './webcomic-page.component.html',
  styleUrls: ['./webcomic-page.component.scss']
})
export class WebcomicPageComponent implements OnInit {

  @ViewChild('currentPage', {static: false})
  currentPage: ElementRef;
  @ViewChildren('comicPage', { read: ElementRef})
  comicPageElements: QueryList<ElementRef>

  focusGained = false;

  chapterNumber: number;
  pageNumber: number;
  pages: ComicPage[] = [];

  // When pages are loaded, we want to put them in this array
  loadedPages: Map<string, ComicPage> = new Map();

  readStyle: ReadStyle = ReadStyle.singleChapter;
  totalPages = 5;
  chapter: ComicChapter;

  scrollLoadRatioFromBottom = 0.25;
  scrollLoadRatioFromTop = 0.45;
  scrollLock = true; // Should we load pages when scroll events are called?

  // Ok, so doing logic based on every little scroll will slow our shit down, so let's save position and keep a min interval
  private minScrollInterval: number = 50;
  private lastRecordedYPosition: number = 0;

  private readStyleMap: {[key: string]: ReadStyle} = {
      singleChapter: ReadStyle.singleChapter,
      singleInfinite: ReadStyle.singleInfinite,
      spreadChapter: ReadStyle.spreadChapter,
      spreadInfinite: ReadStyle.spreadInfinite
  }

  // I like to label all my private variables with the _ prefix
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _pageService: PageService,
    private _scrollPositionService: WindowService,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // I hate nesting subscribe statements like this, please forgive me
    this.parseRoute()
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  /**
   * We want to know the height and y axis position of each page,
   * so we can tell which page the user is looking at.
   */
  loadPageHeightsAndPositions() {

    this.comicPageElements.forEach((page) => {

      const top = page.nativeElement.offsetTop;
      const height = page.nativeElement.clientHeight;
      const comicPage: ComicPage = this.getComicPageFromId(page.nativeElement.id);

      comicPage.yPosition = top;
      comicPage.height = height;

    });

  }


  /** After we build the pages[] element, we want to get the
   * user's focus onto the current page in the url*/
  focusOnCurrentPage() {
    if (!this.focusGained && this.currentPage !== undefined) {
      this.currentPage.nativeElement.scrollIntoView();
      this.focusGained = true;
    }
  }

  /**
   * Read the url query params and apply them to this component
   */
  processQueryParams() {

    this._route.queryParams.subscribe(params => {

      // Do we have a queryParam in our url that requests a specific readstyle?
      const readStyleString = params['readStyle']
      const convertedReadStyle: ReadStyle = this.readStyleMap[readStyleString];

      if (convertedReadStyle != null) {
        this.readStyle = convertedReadStyle
      } else {
        // ...If not let's make an assumption on what readstyle the reader would want based on their screen width
        this.assumeReadStyle();
      }
    })

  }

  /**
   * Look at the size of the user's window and determine how we should assign the readstyle
   * @private
   */
  private assumeReadStyle(): void {

    let  readStyle: ReadStyle = ReadStyle.spreadChapter;
    const windowWidth = window.innerWidth;
    console.log(`Our Window is ${windowWidth} px wide`)

    this.readStyle =  readStyle;
  }

  /**
   * Get the page and chapter information based on the route
   */
  parseRoute(): void  {

    try {

      const paramMap: ParamMap = this._route.snapshot.paramMap;

      this.chapterNumber = Number.parseInt(paramMap.get('chapter'));
      this.pageNumber = Number.parseInt(paramMap.get('page'));

      // this.range = this.parseURLRange(params.get('pageRange'));
      this._pageService.getChapterInfo(this.chapterNumber).subscribe((result: any) => {
        this.chapter = result;
        console.log('chapter info', this.chapter)
        this.determinePagesToLoad();
      });

    } catch (e) {
      console.error('Error trying to parse route!', e);
    }
  }

  /**
   * Loads the initial pages we start with
   */
  determinePagesToLoad(): void {

    // Do we know which page and chapter we want?
    if (this.chapterNumber != null
        && this.pageNumber != null) {

      // Is this page and chapter within range?
      if (this.chapter != null
        && this.pageNumber <= this.chapter.lastPage
        && this.pageNumber >= this.chapter.firstPage) {

        let pagesLeftToLoad = this.totalPages;

        // Get the "current page"
        const currentComicPages = this._pageService.getPages(this.chapterNumber, this.pageNumber, this.pageNumber);
        const currentComicPage = currentComicPages[0];
        this.pages.push(currentComicPage);
        pagesLeftToLoad -= this.pages.length;

        const afterPages: ComicPage[] = this._pageService.getPagesFollowingPage(currentComicPage, this.chapter, pagesLeftToLoad - 2);

        pagesLeftToLoad -= afterPages.length;

        const beforePages: ComicPage[] = this._pageService.getPagesPreceedingPage(currentComicPage, this.chapter, pagesLeftToLoad);

        this.pages = beforePages.concat(this.pages);
        this.pages = this.pages.concat(afterPages);

      }
    }
  }

  onScrollDown() {
    console.log('onScrollDown')

    // If all the pages aren't loaded or we have the scroll lock on, let us not try to get more pages
    const pagesAreLoaded = this.areAllPagesLoaded();
    if (!pagesAreLoaded || this.scrollLock) {
      return;
    }
    const numberOfPagesToAdjust = 2;

    const lastPage: ComicPage = this.pages[this.pages.length - 1];
    const newPages: ComicPage[] = this._pageService.getPagesFollowingPage(lastPage, this.chapter, numberOfPagesToAdjust);
    this.pages = this.pages.concat(newPages);
    const removedPages: ComicPage[] = this.pages.splice(0, newPages.length);

    // For each of our removed pages, we want to get rid of their entries in loadedPages
    removedPages.forEach( (page: ComicPage) => {
      this.loadedPages.delete(page.getPageId());
    });

  }

  onScrollUp() {
    console.log('ScrollUp:')

    // If all the pages aren't loaded or we have the scroll lock on, let us not try to get more pages
    const pagesAreLoaded = this.areAllPagesLoaded();
    if (!pagesAreLoaded || this.scrollLock) {
      return;
    }
    const numberOfPagesToAdjust = 2;

    // Get new pages
    const newPages: ComicPage[] = this._pageService.getPagesPreceedingPage(this.pages[0], this.chapter, numberOfPagesToAdjust);

    if (newPages.length !== 0) {
      // Add new pages to our pages
      this.pages = newPages.concat(this.pages);
      const removedPages: ComicPage[] = this.pages.splice(-newPages.length);

      // For each of our removed pages, we want to get rid of their entries in loadedPages
      removedPages.forEach( (page: ComicPage) => {
        this.loadedPages.delete(page.getPageId());
      });
    }
  }

  recordCurrentScrollPosition() {
    this.lastRecordedYPosition = window.scrollY + (window.innerHeight / 2);
  }

  onScroll() {
    const windowHeight: number = window.innerHeight;

    // We want to say the page in the center of the window is the current page
    const scrollPosition: number = window.scrollY + (windowHeight / 2);

    // Only run this function if a certain distance has been scrolled since the last time we've run this.
    // This is to ensure this function isn't being spammed and slowing everything down.
    if (scrollPosition >= this.lastRecordedYPosition - this.minScrollInterval &&
        scrollPosition <= this.lastRecordedYPosition + this.minScrollInterval) {
      return;
    }

    // Are all of our pages loaded?
    // We cannot accurately determine which page the user is looking at if pages aren't loaded
    if (!this.areAllPagesLoaded()) {
      return;
    }

    const scrollVelocity = scrollPosition - this.lastRecordedYPosition;

    this.recordCurrentScrollPosition();
    this.loadPageHeightsAndPositions();
    this.pages.forEach((page, index) => {

      if (scrollPosition >= page.yPosition &&
          scrollPosition <= page.yPosition + page.height) {

        /*
          IF we are within this element's boundary, then let us consider this the page we are on, and get the ComicPage info
         */
        this._router
          .navigateByUrl(`/read/${page.chapterNumber}/${page.pageNumber}`);
        this.currentPage = this.getComicHTMLElement(page);
        this.pageNumber = page.pageNumber;
        this.chapterNumber = page.chapterNumber;
      }
    });

    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const loadingPageRangeFromTop = pageHeight * this.scrollLoadRatioFromTop;
    const loadingPageRangeFromBottom = pageHeight - (pageHeight * this.scrollLoadRatioFromBottom);

    // Now, let's see if we should load new pages
    if (scrollVelocity > 0 && scrollPosition > loadingPageRangeFromBottom ) {

      // Oh motherfucker? We scrolling down?
      this.onScrollDown()

    } else if (scrollVelocity < 0 && scrollPosition < loadingPageRangeFromTop) {

      // Oh frithermucker? WE scrolling up?
      this.onScrollUp();
    }

  }

  /**
   * Gets the comic ComicPage object from an HTML element ID for that page.
   */
  getComicPageFromId(id: string): ComicPage {

    const idSplit: string[] = id.split('_');
    const chapter: number = Number.parseInt(idSplit[0]);
    const pageNumber: number = Number.parseInt(idSplit[1]);
    let response: ComicPage;

    this.pages.forEach((page: ComicPage, index: number) => {

      if (page.pageNumber == pageNumber && chapter == page.chapterNumber) {
        response =  page;
      }

    });

    return response;
  }

  /**
   * Gets the comic html object from an HTML element ID for that page.
   */
  getComicHTMLElement(comicPage: ComicPage): ElementRef {

    const currentPageId: string = comicPage.chapterNumber.toString() + '_' +comicPage.pageNumber.toString();

    let currentPageRef: ElementRef;
    this.comicPageElements.forEach( (pageElement: ElementRef) => {

      const pageId = pageElement.nativeElement.id;
      if (pageId === currentPageId) {
        currentPageRef = pageElement;
        return;
      }
    });

    return currentPageRef;
  }

  /**
   * Check to see if we have all the pages as loaded.
   * - I predict the error state for a page will give me a headache
   * - For now, we don't declare the entirity "loaded" unless all the pages are loaded
   * - In the future, it might be a percentage
   */
  areAllPagesLoaded(): boolean {
    // Count how many of the pages are loaded
    return this.loadedPages.size === this.pages.length;
  }

  addPageToLoaded(page: ComicPage): void {
    this.loadedPages.set(page.getPageId(), page);
    if (this.areAllPagesLoaded()) {
      const currentComicPage = this.getCurrentComicPage();
      this.currentPage = this.getComicHTMLElement(currentComicPage);
      this.focusOnCurrentPage();
      this.scrollLock = false;
    }
  }

  handlePageLoadError(page: ComicPage): void {
    console.log("Page failed to load!", page);
  }

  getCurrentComicPage() {
    for (const page of this.pages) {
      if (page.pageNumber == this.pageNumber && page.chapterNumber === this.chapterNumber) {
        return page;
      }
    }
    console.error('No current page found!');
    return null;
  }

}
