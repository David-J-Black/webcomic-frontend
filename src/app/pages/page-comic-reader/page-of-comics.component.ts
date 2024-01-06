import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PageService} from "../../service/page.service";
import {ComicChapter} from "../../objects/ComicChapter";
import {ComicPageExtended, ComicPageSimple} from "../../objects/ComicPage";
import {LocalStorageService} from "../../service/localStorage.service";

@Component({
  selector: 'web-page-comic-reader',
  templateUrl: './page-of-comics.component.html',
  styleUrls: ['./page-of-comics.component.scss']
})
export class ComicReaderPage implements OnInit {

  @ViewChildren('comicPage', { read: ElementRef})
  comicPageElements: QueryList<ElementRef> = new QueryList<ElementRef>();
  currentComicPage: ComicPageExtended | undefined;
  chapterNumber: number = -1;
  pageNumber: number = -1;
  pages: ComicPageSimple[] = [];

  // When pages are loaded, we want to put them in this array
  loadedPages: Map<string, ComicPageSimple> = new Map();
  pagesPerLoad: number = this._localStorageService.getComicsPerPage();
  chapter: ComicChapter | undefined;

  // Look at all these precious singletons
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private pageService: PageService,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // I hate nesting subscribe statements like this, please forgive me
    this.parseRoute()
  }

  /**
   * We want to know the height and y axis position of each page,
   * so we can tell which page the user is looking at.
   */
  loadPageHeightsAndPositions() {

    this.comicPageElements.forEach((page) => {

      const top = page.nativeElement.offsetTop;
      const height = page.nativeElement.clientHeight;
      const comicPage: ComicPageSimple | undefined = this.getComicPageFromId(page.nativeElement.id);

      if (comicPage == undefined) {
        throw Error('Could not find comicPage for', page.nativeElement.id);
      }

      comicPage.yPosition = top;
      comicPage.height = height;

    });

  }

  /**
   * Get the page and chapter information based on the route
   * -- This should only done upon initialization
   */
  parseRoute(): void  {

    try {
      this._route.params.subscribe({
        next: ({chapter, page}) => {
          console.debug('params', chapter, page);
          this.chapterNumber = Number.parseInt(chapter);
          this.pageNumber = Number.parseInt(page);

          // We need to get this chapter info
          this.pageService.getChapterInfo(this.chapterNumber).subscribe({
            next:(result: ComicChapter) => {
                this.chapter = result;
                console.log('chapter info', this.chapter)
                this.loadPages();
            }, error: (error: Error) => {
              console.error('Problem getting chapter info!', error);
              throw error;
            }
          });
          this.pageService.getPageInfo(this.chapterNumber, this.pageNumber).subscribe({
            next: (page) => {
              this.currentComicPage = page;
            }, error: (error: Error) => {
              console.error('Problem getting page info from backend!', this.chapterNumber, this.pageNumber, error);
              throw error;
            }
          });
        }
      });

    } catch (e) {
      console.error('Error trying to parse route!', e);
      throw e;
    }
  }

  /**
   * Loads the initial pages we start with
   */
  loadPages(): void {

    // Do we know which page and chapter we want?
    if (this.chapterNumber != null
        && this.pageNumber != null) {

      // Is this page and chapter within range?
      if (this.chapter != null
        && this.pageNumber <= this.chapter.lastPage
        && this.pageNumber >= this.chapter.firstPage) {

        let desiredEndPage = this.pageNumber + this.pagesPerLoad - 1;
        if (desiredEndPage > this.chapter.lastPage ) {
          desiredEndPage = this.chapter.lastPage;
        }


        // Get the "current page"
        this.pageService.getPages(this.chapterNumber, this.pageNumber, desiredEndPage).subscribe({
          next: (pages: ComicPageSimple[]) => {
            console.debug('Got comic pages...', pages)

            if (pages.length <= 0) {
              console.warn('Got 0 pages from the chapterService!');
            }

            this.pages = pages;
          }, error: (error: Error) => {
            console.error('Problem getting pages', this.chapterNumber, this.pageNumber, error)
          }
        });
      }
    }
  }

  onScrollUp() {
    console.log('ScrollUp:')

    // If all the pages aren't loaded or we have the scroll lock on, let us not try to get more pages
    const pagesAreLoaded = this.areAllPagesLoaded();
    if (!pagesAreLoaded) {
      return;
    }
  }

  /**
   * Gets the comic ComicPage object from an HTML element ID for that page.
   */
  getComicPageFromId(id: string): ComicPageSimple | undefined{

    const idSplit: string[] = id.split('_');
    const chapter: number = Number.parseInt(idSplit[0]);
    const pageNumber: number = Number.parseInt(idSplit[1]);
    let response: ComicPageSimple | undefined;

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
  getComicHTMLElement(comicPage: ComicPageSimple | undefined): ElementRef | undefined {

    if (comicPage == undefined) {
      return undefined;
    }
    const currentPageId: string = comicPage.chapterNumber.toString() + '_' + comicPage.pageNumber.toString();

    let currentPageRef: ElementRef | undefined;
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
    // this.stateInformation.loading = false;
  }

  /**
   * When one of the images on the DOM(Document loaded into
   * webbrowser) is all the way loaded it will fire this
   * function and we will do all the processes waiting on
   * this motherfucker.
   * @param page Comic page that is to be marked as loaded.
   */
  markPageAsLoaded(page: ComicPageSimple): void {
    this.loadedPages.set(this.getPageId(page), page);
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
  getCurrentComicPage(): ComicPageSimple | undefined {

    const yPosition = window.scrollY;
    const height = window.innerHeight;
    console.debug(`We are changing the Current Page [yPos:${yPosition}, height:${height}, pages: ${(this.pages)}]`);

    // For each page we have currently loaded
    // Which one of them is the page we're currently looking at
    for (const page of this.pages) {
      if (page.pageNumber == this.pageNumber
        && page.chapterNumber=== this.chapterNumber) {
        return page;
      }
    }
    console.error('No current page found!');
    return undefined;
  }

  /**
   * Determines if a page is the first in a chapter
   */
  isStartOfChapter(page: ComicPageSimple): boolean {
    // Let's get this page's chapter
    let pageChapter: ComicChapter;

    if (page.chapterNumber === this.chapter?.number) {
      pageChapter = this.chapter;
    } else if (this.chapter?.previousChapter && page.chapterNumber === this.chapter.previousChapter.number) {
      pageChapter = this.chapter.previousChapter;
    } else if (this.chapter?.nextChapter && page.chapterNumber === this.chapter?.nextChapter.number) {
      pageChapter = this.chapter.nextChapter
    } else {
      // Ok if we don't have a chapter match that's fucked up
      // I actually don't know what to do here so we'll just return 😅
      return false;
    }

    return page.pageNumber === pageChapter.firstPage
  }

  /**
   * Extracts a chapter from a page
   * @param page
   */
  getPageChapter(page: ComicPageSimple): ComicChapter | undefined {

    // If there's no page, then there's no chapter!
    if (!page) {
      return undefined;
    }

    if (page.chapterNumber === this.chapter?.number) {
      return this.chapter;
    } else if (this.chapter?.previousChapter && page.chapterNumber === this.chapter?.previousChapter.number) {
      return this.chapter.previousChapter;
    } else if (this.chapter?.nextChapter && page.chapterNumber === this.chapter?.nextChapter.number) {
      return this.chapter?.nextChapter
    }

    // Well shit, why didn't we get a chapter??
    console.warn(`No chapter found for page! That fucking sucks! ${page}.`)
    return undefined;
  }

  public getPageId(page: ComicPageSimple) {
    return page.chapterNumber + "_" + page.pageNumber;
  }

  onPageSelected(event: number) {
    this.pagesPerLoad = event;
  }
}
