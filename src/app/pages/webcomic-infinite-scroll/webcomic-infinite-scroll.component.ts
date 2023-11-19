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
import {ChapterService} from "../../service/chapter.service";
import {NavigationService} from "../../service/navigation.service";
import {ComicChapter, ComicPageSimple} from "../../objects/ComicChapter";

enum ReadStyle {
  singleChapter = 'singleChapter',
  singleInfinite = 'singleInfinite',
  spreadChapter = 'spreadChapter',
  spreadInfinite = 'spreadInfinite'
}

/**
 * What exactly should we be expecting when the program finishes loading?
 */
interface LoadState {
  loading: boolean,
  scrollingUp: boolean,
  pageToScrollTo: ComicPageSimple,
  documentHeightPreLoad: number,
  scrollYPosPreLoad: number
}

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './webcomic-infinite-scroll.component.html',
  styleUrls: ['./webcomic-infinite-scroll.scss']
})
export class WebcomicInfiniteScrollComponent implements OnInit {

  @ViewChild('currentPage', {static: false})
  currentPage: ElementRef;
  @ViewChildren('comicPage', { read: ElementRef})
  comicPageElements: QueryList<ElementRef>

  stateInformation: LoadState = {
    loading: false,
    scrollingUp: false,
    pageToScrollTo: undefined,
    documentHeightPreLoad: undefined,
    scrollYPosPreLoad: undefined
  }

  initialChapterNumber: number;
  initialPageNumber: number;
  pages: ComicPageSimple[] = [];

  // When pages are loaded, we want to put them in this array
  loadedPages: Map<string, ComicPageSimple> = new Map();
  readStyle: ReadStyle = ReadStyle.singleChapter;
  initialPageCount = 10;
  pagesPerLoad: number = 10;
  chapter: ComicChapter;

  initialPage: ComicPageSimple;

  /**
   *  When we load a page from a specified chapter/number, we will
   *  have a header letting the user know which page and chapter they are on
   */
  headerLock = false;

  private scrollLoadRatioFromBottom = 0.05;
  private scrollLoadRatioFromTop = 0.05;

  private lastRecordedYPosition: number = 0;

  private readStyleMap: {[key: string]: ReadStyle} = {
      singleChapter: ReadStyle.singleChapter,
      singleInfinite: ReadStyle.singleInfinite,
      spreadChapter: ReadStyle.spreadChapter,
      spreadInfinite: ReadStyle.spreadInfinite
  }

  // I like to label all mynpm inst private variables with the _ prefix
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _pageService: ChapterService,
    private _scrollPositionService: NavigationService,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

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
      const comicPage: ComicPageSimple = this.getComicPageFromId(page.nativeElement.id);

      comicPage.yPosition = top;
      comicPage.height = height;

    });

  }

  /**
   * Right before we make changes to the pages array, we should save our current browsing state
   */
  saveLoadState(): void {
    this.stateInformation.loading = true;
    this.stateInformation.documentHeightPreLoad = this.getDocumentHeight();
    this.stateInformation.pageToScrollTo = this.getCurrentComicPage();
    this.stateInformation.scrollingUp = this.lastRecordedYPosition < window.scrollY;
    this.stateInformation.scrollYPosPreLoad = window.scrollY;
    this.saveCurrentScrollPosition();
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
   * -- This should only done upon initialization
   */
  parseRoute(): void  {

    try {
      const paramMap: ParamMap = this._route.snapshot.paramMap;

      this.initialChapterNumber = Number.parseInt(paramMap.get('chapter'));
      this.initialPageNumber = Number.parseInt(paramMap.get('page'));
      // Determine if we are at the beginning of the comic
      this.headerLock = !(this.initialChapterNumber === 1 && this.initialPageNumber === 1);

      // this.range = this.parseURLRange(params.get('pageRange'));
      this._pageService.getChapterInfo(this.initialChapterNumber).subscribe((result: ComicChapter) => {
        this.chapter = result;
        console.log('chapter info', this.chapter)
        this.loadInitialPages();
      });

    } catch (e) {
      console.error('Error trying to parse route!', e);
    }
  }

  /**
   * Loads the initial pages we start with
   */
  loadInitialPages(): void {

    // Do we know which page and chapter we want?
    if (this.initialChapterNumber != null
        && this.initialPageNumber != null) {

      // Is this page and chapter within range?
      if (this.chapter != null
        && this.initialPageNumber <= this.chapter.lastPage
        && this.initialPageNumber >= this.chapter.firstPage) {

        let pagesLeftToLoad = this.initialPageCount;

        // Get the "current page"
        const currentComicPages = this._pageService.getPages(this.initialChapterNumber, this.initialPageNumber, this.initialPageNumber);
        const currentComicPage = currentComicPages[0];
        this.pages.push(currentComicPage);
        pagesLeftToLoad -= this.pages.length;

        const afterPages: ComicPageSimple[] = this._pageService.getPageAfter(currentComicPage, this.chapter, pagesLeftToLoad - 2);

        pagesLeftToLoad -= afterPages.length;

        // If we aren't header locked load the pages before the current one
        if (!this.headerLock) {
          const beforePages: ComicPageSimple[] = this._pageService.getPageBefore(currentComicPage, this.chapter, pagesLeftToLoad);

          // Create a bookmark before we load
          this.pages = beforePages.concat(this.pages);
        }
        this.pages = this.pages.concat(afterPages);
      }
    }
  }

  onScrollDown() {
    console.log('onScrollDown')
    // If all the pages aren't loaded or we have the scroll lock on, let us not try to get more pages
    const pagesAreLoaded = this.areAllPagesLoaded();
    if (!pagesAreLoaded) {
      console.debug(`Scroll Down Event activated, but not all pages are loaded`)
      return;
    }

    const lastPage: ComicPageSimple = this.pages[this.pages.length - 1];

    // We're going to get new pages
    // First we need to make sure the chapter matches our chapterNumber
    let newPages: ComicPageSimple[]
    if (lastPage.chapterNumber === this.chapter.number) {
      newPages = this._pageService.getPageAfter(lastPage, this.chapter, this.pagesPerLoad);
    } else if (lastPage.chapterNumber === this.chapter.nextChapter.number) {
      newPages = this._pageService.getPageAfter(lastPage, this.chapter.nextChapter, this.pagesPerLoad);
    }

    // Save all the information about our position before we add more pages
    this.saveLoadState();
    console.debug('Adding new pages')
    this.pages = this.pages.concat(newPages);
    this.stateInformation.loading = false;
  }

  onScrollUp() {
    console.log('ScrollUp:')

    // If all the pages aren't loaded or we have the scroll lock on, let us not try to get more pages
    const pagesAreLoaded = this.areAllPagesLoaded();
    if (!pagesAreLoaded) {
      return;
    }

    // If we don't have a headerlock on, we can load previous pages.
    if (!this.headerLock) {
      this.loadPagesOnTop();
    }
  }

  private loadPagesOnTop() {
    // Get new pages
    // Let's check for the edgecase where the page we want to get is the previous chapter
    let newPages: ComicPageSimple[];

    if (this.pages[0].chapterNumber === this.chapter.number) {
      newPages = this._pageService.getPageBefore(this.pages[0], this.chapter, this.pagesPerLoad);
    } else if (this.pages[0].chapterNumber === this.chapter.previousChapter.number) {
      newPages = this._pageService.getPageBefore(this.pages[0], this.chapter.previousChapter, this.pagesPerLoad);
    }

    if (newPages.length !== 0) {
      // Add new pages to our pages

      this.saveLoadState();
      this.pages = newPages.concat(this.pages);

    }
  }

  /**
   * Remove pages from the page array
   *  This is untested, if I decide I want to go back to a model
   *  where we unload pages then I will dust off this function
   *  and test it.
   * @param numberOfPages If negative, we will remove pages from
   *                      the bottom of the array
   */
  removePages(numberOfPages: number): number {
      const removedPages: ComicPageSimple[] = this.pages.splice(numberOfPages);
      let pageHeightBeforeRemoval: number;
      // If we are removing pages from the top lets save the user's current scroll position
      if (numberOfPages > 0) {
        pageHeightBeforeRemoval = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
      }
      // For each of our removed pages, we want to get rid of their entries in loadedPages
      removedPages.forEach( (page: ComicPageSimple) => {
        this.loadedPages.delete(page.getPageId());
      });

      const pageHeightAfterRemoval = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const differenceBetweenHeights = pageHeightBeforeRemoval - pageHeightAfterRemoval;
      window.scrollTo(0, window.scrollY - differenceBetweenHeights);
      return removedPages.length;
  }

  saveCurrentScrollPosition() {
    this.lastRecordedYPosition = window.scrollY;
  }



  onScroll() {

    // We want to say the page in the center of the window is the current page
    const scrollPosition: number = window.scrollY;
    this.saveCurrentScrollPosition();

    // Are all of our pages loaded?
    // We cannot accurately determine which page the user is looking at if pages aren't loaded
    if (!this.areAllPagesLoaded()) {
      return;
    }

    this.loadPageHeightsAndPositions();
    this.pages.forEach((page) => {

      if (scrollPosition >= page.yPosition &&
          scrollPosition <= page.yPosition + page.height) {

        /*
          IF we are within this element's boundary, then let us consider this the page we are on, and get the ComicPage info
         */
        this._router
          .navigateByUrl(`/infinite-scroll/${page.chapterNumber}/${page.pageNumber}`);
        this.currentPage = this.getComicHTMLElement(page);

        // If we are still loading pages, it's a little buggy if we change the page#
        if (this.areAllPagesLoaded()) {
          this.initialPageNumber = page.pageNumber;
          if (page.chapterNumber !== this.initialChapterNumber) {
            this.initialChapterNumber = page.chapterNumber;
            this._pageService.getChapterInfo(this.initialChapterNumber).subscribe( (result: ComicChapter) => {
              this.chapter = result;
            });
          }
        }
      }
    });

    // Now, let's see if we should load new pages
    if (window.scrollY + window.innerHeight > this.getDocumentHeight() * (1 - this.scrollLoadRatioFromBottom) ) {

      // Oh motherfucker? We scrolling down?
      this.onScrollDown()

    } else if (window.scrollY < this.getDocumentHeight() * this.scrollLoadRatioFromTop) {

      // Oh frithermucker? WE scrolling up?
      this.onScrollUp();
    }

  }

  /**
   * Get the current height for the document.
   */
  getDocumentHeight(): number {
    return Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
  }

  /**
   * Gets the comic ComicPage object from an HTML element ID for that page.
   */
  getComicPageFromId(id: string): ComicPageSimple {

    const idSplit: string[] = id.split('_');
    const chapter: number = Number.parseInt(idSplit[0]);
    const pageNumber: number = Number.parseInt(idSplit[1]);
    let response: ComicPageSimple;

    this.pages.forEach((page: ComicPageSimple) => {

      if (page.pageNumber == pageNumber && chapter == page.chapterNumber) {
        response =  page;
      }

    });

    return response;
  }

  /**
   * Gets the comic html object from an HTML element ID for that page.
   */
  getComicHTMLElement(comicPage: ComicPageSimple): ElementRef {

    if (comicPage == null) {
      return null
    }
    const currentPageId: string = comicPage.chapterNumber.toString() + '_' + comicPage.pageNumber.toString();

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

  /**
   * This function is called when the last comic image
   * is loaded. Incredibly important shit do not delete
   * me 🥺
   */
  loadedAllPages() {

    // Determine which page as of right now is  the current page
    const currentComicPage = this.getCurrentComicPage();
    this.currentPage = this.getComicHTMLElement(currentComicPage);
    const comicHtmlElement: ElementRef = this.getComicHTMLElement(this.stateInformation.pageToScrollTo);

    if (comicHtmlElement === null) {
      // Damn, this thing isn't on the HTML dom yet 😔
      return;
    }

    comicHtmlElement.nativeElement.scrollIntoView();
    this.stateInformation.loading = false;
  }

  /**
   * When one of the images on the DOM(Document loaded into
   * webbrowser) is all the way loaded it will fire this
   * function and we will do all the processes waiting on
   * this motherfucker.
   * @param page Comic page that is to be marked as loaded.
   */
  markPageAsLoaded(page: ComicPageSimple): void {
    this.loadedPages.set(page.getPageId(), page);
    if (this.areAllPagesLoaded()) {

      // This page was the last one! Activate last page event.
      this.loadedAllPages();
    }
  }

  handlePageLoadError(page: ComicPageSimple): void {
    console.log("Page failed to load!", page);
  }

  /**
   * Find's out what page of the comic is currently in the
   * middle of the browser window right now.
   */
  getCurrentComicPage() {

    const yPosition = window.scrollY;
    const height = window.innerHeight;
    console.debug(`We are changing the Current Page [yPos:${yPosition}, height:${height}, pages: ${(this.pages)}]`);

    // For each page we have currently loaded
    // Which one of them is the page we're currently looking at
    for (const page of this.pages) {
      if (page.pageNumber == this.initialPageNumber
        && page.chapterNumber=== this.initialChapterNumber) {
        return page;
      }
    }
    console.error('No current page found!');
    return null;
  }

  /**
   * Determines if a page is the first in a chapter
   */
  isStartOfChapter(page: ComicPageSimple): boolean {
    // Let's get this page's chapter
    let pageChapter: ComicChapter;

    if (page.chapterNumber === this.chapter.number) {
      pageChapter = this.chapter;
    } else if (this.chapter.previousChapter && page.chapterNumber === this.chapter.previousChapter.number) {
      pageChapter = this.chapter.previousChapter;
    } else if (this.chapter.nextChapter && page.chapterNumber === this.chapter.nextChapter.number) {
      pageChapter = this.chapter.nextChapter
    } else {
      // Ok if we don't have a chapter match that's fucked up
      // I actually don't know what to do here so we'll just return 😅
      return false;
    }

    return page.pageNumber === pageChapter.firstPage
  }

  getInitialChapterNumber(page: ComicPageSimple): number {

    // No page? Get the fuck outta here!
    if (!page) {
      console.warn(`No page numbnuts`);
      return null;
    }

    // Rip open this fucking page and pull out the chapter
    // Chant Kali Ma while doing it
    return this.getPageChapter(page).number;
  }


  /**
   * Extracts a chapter from a page
   * @param page
   */
  getPageChapter(page: ComicPageSimple): ComicChapter {

    // If there's no page, then there's no chapter!
    if (!page) {
      return null;
    }

    if (page.chapterNumber === this.chapter.number) {
      return this.chapter;
    } else if (this.chapter.previousChapter && page.chapterNumber === this.chapter.previousChapter.number) {
      return this.chapter.previousChapter;
    } else if (this.chapter.nextChapter && page.chapterNumber === this.chapter.nextChapter.number) {
      return this.chapter.nextChapter
    }

    // Well shit, why didn't we get a chapter??
    console.warn(`No chapter found for page! That fucking sucks! ${page}.`)
    return null;
  }

  unlockHeader() {
    this.headerLock = false;
    this.loadPagesOnTop();
  }

}
