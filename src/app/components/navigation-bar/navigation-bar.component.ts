import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LocalStorageService} from "../../service/localStorage.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../service/navigation.service";
import {ComicPageSimple} from "../../objects/ComicPage";
import {ComicChapter} from 'src/app/objects/ComicChapter';

@Component({
  selector: 'cmc-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnChanges {

  pageOptions = [1, 3, 5, 10, 20];

  selectedNumber: number = 3;
  @Input() comicPages: ComicPageSimple[] = [];
  @Input() chapter: ComicChapter | undefined;
  @Output() pageSelected: EventEmitter<number> = new EventEmitter<number>();
  offset: any;
  haveFirstPage: boolean = false;
  haveLastPage: boolean = false;
  private loading: boolean = true;

  constructor(
    private _localStorageService: LocalStorageService,
    private _router: Router,
    private _navigationalService: NavigationService,
  ) {
  }

  ngOnInit(): void {
    this.selectedNumber = this._localStorageService.getComicsPerPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug('changes',changes);

    const comicPages = changes['comicPages'];
    const chapter = changes['chapter'];
    if (comicPages && chapter) {
      this._lookForSpecialPageCharacteristics()
    }
  }

  _lookForSpecialPageCharacteristics() {
    if (this.comicPages.length > 0) {
      let haveFirstPage = false;
      let haveLastPage = false;
      for (let page of this.comicPages) {
        if (page.pageNumber == this.chapter?.firstPage && this.chapter.previousChapter == undefined) {
          haveFirstPage = true;
        }
        if (page.pageNumber == this.chapter?.lastPage && this.chapter.nextChapter == undefined) {
          haveLastPage = true;
        }
      }
      this.haveFirstPage = haveFirstPage;
      this.haveLastPage = haveLastPage;
    } else if (this.comicPages.length == 0) {
      console.warn('comicPages elmeent is empty!');
      this.loading = true;
    } else {
      console.debug('got Comic Pages!', this.comicPages);
      this.loading = true;
    }

  }

  emitSelection() {
    console.debug(this.selectedNumber);
    this._localStorageService.setComicsPerPage(this.selectedNumber);
    window.location.reload();
    // this._lookForSpecialPageCharacteristics();
  }

  /**
   * Navigate user to first page
   */
  goToFirst(): void {
    this._navigationalService.goToFirstPage();
  }

  /**
   * Navigate use to set of pages preceeding this one.
   */
  goToPrevious(): void {
    console.debug('Going to previous page set', this.comicPages)

    if (!this.chapter) {
      throw new Error('No comic chapter in navigation bar!');
    }

    if (this.comicPages.length > 0) {
      this._navigationalService.goToPreviousPageSet(this.comicPages[0], this.chapter, this.selectedNumber).then((response) => {
        console.debug('goToPreviousPageResponse', response);
      }, (error) => {
        throw error;
      });
    } else {
      console.error('Problem trying to go to previous page', this.comicPages);
      throw Error("No current page!");
    }
  }

  goToNext(): void {
    console.debug('Going to next page set', this.comicPages)

    if (!this.chapter) {
      throw Error("No current chapter in navigation bar 😰!");
    }

    if (this.comicPages.length <= 0) {
      throw Error("No current page!: " + JSON.stringify(this.comicPages));
    }

    this._navigationalService.goToNextPage(this.comicPages[0], this.chapter, this.selectedNumber)
    .then(undefined, (error) => {
      console.error('Problem going to next page!', error);
      throw error;
    });
  }

  goToLast(): void {
    this._navigationalService.goToLastPage(this.comicPages.length - 1);
  }
}
