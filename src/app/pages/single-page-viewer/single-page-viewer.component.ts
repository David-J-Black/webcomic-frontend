import {
  Component,
  OnInit,

} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ChapterService} from "../../service/chapter.service";
import {NavigationService} from "../../service/navigation.service";
import {ComicPageExtended, ComicPageSimple} from "../../objects/ComicPage";
import {ComicChapter} from "../../objects/ComicChapter";

@Component({
  selector: 'cmc-single-page-viewer',
  templateUrl: './single-page-viewer.component.html',
  styleUrls: ['./single-page-viewer.component.scss']
})
export class SinglePageViewer implements OnInit {
  focusGained = false;

  chapter: ComicChapter | undefined;
  comicPage: ComicPageExtended | undefined;
  previousPage: ComicPageSimple | undefined;
  nextPage: ComicPageSimple | undefined;

  // I like to label all my private variables with the _ prefix
  constructor(
    private _route: ActivatedRoute,
    private _pageService: ChapterService,
    private _navigationService: NavigationService
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
      const chapterNumber = Number.parseInt(paramMap.get('chapter') || '-1');
      const pageNumber = Number.parseInt(paramMap.get('page') || '-1');

      this._pageService.getPageInfo(chapterNumber, pageNumber).subscribe((response: ComicPageExtended) => {
        console.log('page got!', response)
        this.comicPage = response;
        this.comicPage.url = this._pageService.getPageURL(chapterNumber, pageNumber);
        console.log(this.comicPage);
        this._pageService.getChapterInfo(chapterNumber).subscribe((chapter: ComicChapter) => {
          console.log('chapter', chapter);
          this.chapter = chapter;

        });

      });

    } catch (e) {
      console.error('Error trying to parse route!', e);
    }
  }

  goToFirstPage(): void {
    this._navigationService.goToFirstPage();
  }

  goToLastPage(): void {
    this._navigationService.goToLastPage();
  }

  goToPreviousPage(): void {
    if (this.previousPage != undefined){
      this._navigationService.goToSinglePage(this.previousPage.chapterNumber, this.previousPage.pageNumber);
      this.parseRoute();
    }
  }

  goToNextPage(): void {
    if (this.nextPage != undefined){
      this._navigationService.goToSinglePage(this.nextPage.chapterNumber, this.nextPage.pageNumber);
      this.parseRoute();
    }
  }

  handlePageLoadError(page: ComicPageSimple): void {
    console.log("Page failed to load!", page);
  }

}
