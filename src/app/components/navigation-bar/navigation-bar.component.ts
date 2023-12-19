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
    if (comicPages || chapter) {
      if (comicPages.currentValue.size > 0) {
        let haveFirstPage = false;
        let haveLastPage = false;
        for (let page of this.comicPages) {
          if (page.pageNumber == this.chapter?.firstPage) {
            haveFirstPage = true;
          }
          if (page.pageNumber == this.chapter?.lastPage) {
            haveLastPage = true;
          }
        }
        this.haveFirstPage = haveFirstPage;
        this.haveLastPage = haveLastPage;
      }
    }
  }

  emitSelection() {
    console.debug(this.selectedNumber);
    this._localStorageService.setComicsPerPage(this.selectedNumber);
  }

  goToFirst(): void {
    this._navigationalService.goToFirstPage();
  }

  goToPrevious(): void {
    console.debug('Going to previous page set', this.comicPages)
    if (this.comicPages.length > 0 && this.chapter) {
      this._navigationalService.goToPreviousPage(this.comicPages[0], this.chapter, this.comicPages.length).then((response) => {
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
    if (this.comicPages.length > 0 && this.chapter) {
      this._navigationalService.goToNextPage(this.comicPages[this.comicPages.length - 1], this.chapter, this.comicPages.length).then((response) => {
        console.debug('goToNextPage response', response);
      }, (error) => {
        throw error;
      });
    } else {
      console.error('Problem trying to go to next page', this.comicPages);
      throw Error("No current page!");
    }
  }

  goToLast(): void {
    this._navigationalService.goToLastPage();
  }
}
