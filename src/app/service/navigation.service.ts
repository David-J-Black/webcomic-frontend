import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ChapterService} from "./chapter.service";
import {ComicPageExtended, ComicPageSimple} from "../objects/ComicPage";
import {environment} from "../../environments/environment";
import {ComicChapter} from "../objects/ComicChapter";

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

  goToExtrasPage() {
    const url = `/extras`;
    this._router.navigate([url])
  }

  goToTableOfContents() {
    const url = `table-of-contents`;
    this._router.navigate([url])
  }

  goToSinglePage(chapterNum: number, pageNum: number) {
    this._router.navigate(['/page', chapterNum, pageNum])
    console.log(this._router.url)
  }

  goToInfiniteScrollPage(chapterNum: number, pageNum: number) {
    this._router.navigate(['/infinite-scroll', chapterNum, pageNum])
    console.log(this._router.url)
  }

  async goToFirstPage(): Promise<void> {
    this._chapterService.getFirstPage().subscribe((page) => {
      this._router.navigate([page.chapterNumber, page.pageNumber]);
    });
  }

  async goToFirstPageSingle(): Promise<void> {
    this._chapterService.getFirstPage().subscribe((page) => {
      this._router.navigate(['/page', page.chapterNumber, page.pageNumber]);
    });
  }

  async goToPage(chNumber: number, pgNumber: number): Promise<boolean> {
    console.debug('Going to page',chNumber,pgNumber);
    return this._router.navigate([chNumber, pgNumber]).then(
      (good) => {
        console.debug(good);
        return true;
      }, (bad) => {
        throw bad;
      });
  }

  /**
   * Before we can go to a previous page, we need to confirm it exists.
   */
  async goToPreviousPage(currentPage: ComicPageSimple, chapter: ComicChapter, offset: number | undefined): Promise<boolean> {
    const finalOffset = offset ? offset : 1;
    console.debug("going to page before ", currentPage, 'offset', finalOffset);
    return new Promise((resolve, reject) => {
      let desiredPageNumber = currentPage.pageNumber - finalOffset;

      // Is the previous page within this chapter?
      if (
        chapter.firstPage <= desiredPageNumber
        && chapter.lastPage >= desiredPageNumber
      ) {
        console.debug('going to page:',currentPage.chapterNumber, desiredPageNumber);
        this.goToPage(currentPage.chapterNumber, desiredPageNumber);

      // Is there a previous chapter?
      } else if (chapter.previousChapter) {

        desiredPageNumber = chapter.previousChapter.lastPage - finalOffset;
        if (!chapter.previousChapter.lastPage) {
          reject('Could not find A last page for the previous chapter!');
        }

        // If the previous chapter does exist, then go to the beginning of last set, according to our offset
        if (desiredPageNumber >= chapter.previousChapter.firstPage ) {
          resolve(this.goToPage(
            chapter.previousChapter.number,
            desiredPageNumber
          ));
        } else {
          resolve(this.goToPage(
            chapter.previousChapter.number,
            chapter.previousChapter.firstPage
          ));
        }

      } else {
        reject('This is the first page!')
      }
    })
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

  /**
   * Before we can go to a previous page, we need to confirm it exists.
   */
  async goToNextPage(currentPage: ComicPageSimple, chapter: ComicChapter, offset: number | undefined): Promise<boolean> {
    const finalOffset = offset ? offset : 1;
    console.debug("going to page after ", currentPage, 'offset', finalOffset);
    return new Promise((resolve, reject) => {
      let desiredPageNumber = currentPage.pageNumber + finalOffset;

      // Is the next page within this chapter?
      if (
        chapter.firstPage <= desiredPageNumber
        && chapter.lastPage >= desiredPageNumber
      ) {
        console.debug('going to page:',currentPage.chapterNumber, desiredPageNumber);
        this.goToPage(currentPage.chapterNumber, desiredPageNumber);

        // Is there a next chapter?
      } else if (chapter.nextChapter) {

        desiredPageNumber = chapter.nextChapter.firstPage
        if (!chapter.nextChapter.firstPage) {
          reject('Could not find A first page for the previous chapter!');
        }

        // If the next chapter does exist, then go to the beginning
        resolve(this.goToPage(
          chapter.nextChapter.number,
          chapter.nextChapter.firstPage
        ));

      } else {
        reject('This is the last page!')
      }
    })
  }
}
