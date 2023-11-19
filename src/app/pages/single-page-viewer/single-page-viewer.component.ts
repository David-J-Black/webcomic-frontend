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
import {ComicPageExtended, ComicPageSimple} from "../../objects/ComicChapter";

@Component({
  selector: 'cmc-single-page-viewer',
  templateUrl: './single-page-viewer.component.html',
  styleUrls: ['./single-page-viewer.component.scss']
})
export class SinglePageViewer implements OnInit {

  @ViewChild('currentPage', {static: false})
  currentPage: ElementRef;
  @ViewChildren('comicPage', { read: ElementRef})
  comicPageElements: QueryList<ElementRef>

  focusGained = false;

  chapterNumber: number;
  pageNumber: number;
  page: ComicPageExtended;

  // I like to label all my private variables with the _ prefix
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
    // I hate nesting subscribe statements like this, please forgive me
    this.parseRoute()
  }

  /**
   * Get the page and chapter information based on the route
   */
  parseRoute(): void  {

    try {

      const paramMap: ParamMap = this._route.snapshot.paramMap;

      // Initialize chapter and page numbers
      this.chapterNumber = Number.parseInt(paramMap.get('chapter'));
      this.pageNumber = Number.parseInt(paramMap.get('page'));

      this._pageService.getPageInfo(this.chapterNumber, this.pageNumber).subscribe((response: any) => {
        this.page = response;
        this.page.url = this._pageService.getPageURL(this.chapterNumber, this.pageNumber);
        console.log(this.page);
      });

    } catch (e) {
      console.error('Error trying to parse route!', e);
    }
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

  handlePageLoadError(page: ComicPageSimple): void {
    console.log("Page failed to load!", page);
  }

}
