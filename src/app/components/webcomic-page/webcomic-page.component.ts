import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {Routes, RouterModule, ActivatedRoute} from "@angular/router";
import {PageService} from "../../service/page.service";
import {WindowService} from "../../service/window.service";

/**
 * I'm probs gonna throw this in the dumpster, but I'll keep the object here for now
 * Describes a range of pages that we would fetch from the backend
 */
export class PageRange {
  chapter: number
  beginning: number
  end: number

  constructor(chapter: number,
              beginning: number,
              end: number) {
    this.chapter = chapter;
    this.beginning = beginning;
    this.end = end;
  }
}

export class Pagination {
  itemsPerPage: number;
  startingChapter: number
  startingPage: number;

  constructor(itemsPerPage: number,
              startingChapter: number,
              startingPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.startingChapter = startingChapter;
    this.startingPage = startingPage;
  }
}

export class ComicPage {
  pageNumber: number;
  chapterNumber: number;
  pageUrl: string;
}

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

  chapterNumber: number;
  range = new PageRange(1, 1,2);
  pages: string[] = [];
  pageNumber: number;
  readStyle: ReadStyle = ReadStyle.singleChapter;
  totalPages = 5;
  chapter: any;

  private readStyleMap: {[key: string]: ReadStyle} = {
      singleChapter: ReadStyle.singleChapter,
      singleInfinite: ReadStyle.singleInfinite,
      spreadChapter: ReadStyle.spreadChapter,
      spreadInfinite: ReadStyle.spreadInfinite
  }

  constructor(
    private _route: ActivatedRoute,
    private _pageService: PageService,
    private _scrollPositionService: WindowService,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // I hate nesting subscribe statements like this, please forgive me
    this._route.paramMap.subscribe( params => {
      this.chapterNumber = Number.parseInt(params.get('chapter'));
      // this.range = this.parseURLRange(params.get('pageRange'));
      this._pageService.getChapterInfo(this.chapterNumber).subscribe((result: any) => {
        this.chapter = result;
        this.pages = this._pageService.getPageURLs(this.chapterNumber, this.chapter.firstPage, this.chapter.lastPage);
        console.log(this.pages);
      });
    });



    const scrollY = this._scrollPositionService.getScrollPosition();
    window.scrollTo(0, scrollY);
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
   * We need to know what the last part of the url is
   * @param route the routeParams in string form
   */
  parseURLRange(route: string): PageRange  {
    console.log(route);

    const parts: string[] = route.split("-");

    const part1: number = Number.parseInt(parts[0]);
    const part2: number = Number.parseInt(parts[1]);

    return new PageRange(this.chapterNumber, part1, part2);
  }

  /**
   * To be used when infinite scrolling gets implemented
   */
  loadPages(): void {
    this.pages = [];

    const firstPageOfSet = this.pageNumber - Math.floor(this.totalPages / 2);
    const lastPageOfSet = this.pageNumber + Math.ceil(this.totalPages / 2);

    for(let i = firstPageOfSet; i <= lastPageOfSet; i++) {



    }

  }

}
