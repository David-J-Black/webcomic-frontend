import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ChapterService} from "./chapter.service";
import {ComicPageExtended} from "../objects/ComicPage";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  constructor(
      private _router: Router,
      private _chapterService: ChapterService
  ) { }

  goToAboutPage() {
    const url = `about`;
    this._router.navigate([url])
  }

  goToTableOfContents() {
    const url = `table-of-contents`;
    this._router.navigate([url])
  }

  goToSinglePage(chapterNum: number, pageNum: number) {
    console.log('epnis')
    this._router.navigate(['/page', chapterNum, pageNum])
    console.log(this._router.url)
  }

  async goToFirstPage(): Promise<void> {
    this._chapterService.getFirstPage().subscribe((page) => {
      this._router.navigate(['/infinite-scroll', page.chapterNumber, page.pageNumber]);
    });
  }

  async goToFirstPageSingle(): Promise<void> {
    this._chapterService.getFirstPage().subscribe((page) => {
      this._router.navigate(['/page', page.chapterNumber, page.pageNumber]);
    });
  }

  async goToLastPage(): Promise<void> {
    this._chapterService.getLastPage().subscribe((page) => {
      this._router.navigate(['/infinite-scroll', page.chapterNumber, page.pageNumber]);
    });
  }

  async goToLastPageSingle(): Promise<void> {
    this._chapterService.getLastPage().subscribe((page: ComicPageExtended) => {
      this._router.navigate(['/page', page.chapterNumber, page.pageNumber]);
    });
  }
}
