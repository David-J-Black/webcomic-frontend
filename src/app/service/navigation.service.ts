import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {PageService} from "./page.service";
import {ComicPageSimple} from "../objects/ComicPage";
import {ComicChapter} from "../objects/ComicChapter";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
      private _router: Router,
      private _chapterService: PageService
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

  /**
   * @Deprecated
   */
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
  async goToPreviousPageSet(currentPage: ComicPageSimple, chapter: ComicChapter, requestSize: number): Promise<boolean> {
    const finalOffset = requestSize <= 0 ? 1 : requestSize;

    if (requestSize <= 0) {
      console.error('Cannot have a negative offset', requestSize);
      throw Error('fuck');
    }

    console.debug("going to page before ", currentPage, 'offset', finalOffset);
    return new Promise((resolve, reject) => {
      let desiredPageNumber = currentPage.pageNumber - finalOffset;

      // Is the first page of the previous set before the start of current chapter?
      if (chapter.firstPage <= desiredPageNumber
      ) {
        console.debug('going to page[',desiredPageNumber,'] set starting with Chapter:', currentPage.chapterNumber,
          'page', desiredPageNumber);
        this.goToPage(currentPage.chapterNumber, desiredPageNumber);

      // Is this past the first page? Conditional
      } else if (desiredPageNumber < chapter.firstPage) {
        if (chapter.previousChapter == null) {
          console.debug('This is the first page in the comic... cannot navigate backwards!');
          reject('First Page of entire comic');
        }

        console.debug('The desired page',desiredPageNumber,
          'is before the first page of the current chapter', chapter);
        desiredPageNumber = chapter.previousChapter.lastPage + desiredPageNumber;

        if (desiredPageNumber + requestSize - 1 == chapter.previousChapter.lastPage) {
          this.goToPage(chapter.previousChapter.number, desiredPageNumber);
          return;
        }

        console.debug('Giving Previous chapter last page set ch:', chapter.number, 'pg', chapter.firstPage);
        this.goToPage(chapter.number, chapter.firstPage);

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
        console.warn('This is the first page!')
        reject(Error('This is the first page, cannot go to previous page!'))
      }
    })
  }

  async goToLastPage(offset: number): Promise<void> {
    offset = offset ? offset : 0;

    console.debug('requesting Last Page...');
    this._chapterService.getLastPage().subscribe((page) => {
      console.debug('got Last Page!', page);
      const finalPageNumber = page.pageNumber - offset;
      this._router.navigate([page.chapterNumber, finalPageNumber]);
    });
  }

  /**
   * Go to the next page of a comic.
   *
   * @param {ComicPageSimple} currentPage - The current page of the comic.
   * @param {ComicChapter} chapter - The current chapter of the comic.
   * @param {number | undefined} offset - The offset to navigate to the next page. Default is 1.
   *
   * @return {Promise<boolean>} - Promise that resolves to true if the navigation was successful, otherwise false.
   */
  async goToNextPage(currentPage: ComicPageSimple,
                     chapter: ComicChapter,
                     offset: number | undefined): Promise<boolean> {
    console.debug('going to next page: currenPage',currentPage, )
    offset = offset ? offset : 1;
    console.debug("going to page after ", currentPage, 'offset', offset);
    return new Promise((resolve, reject) => {
      /* What page do we predict we want?
        We'll, i predict we will want to go to the current chapter:
        UNLESS! This chapter ends within the next amount of pages,
        an [offset] number of pages.
       */
      if (!offset) {
        throw Error('somehow got an undefined offset?');
      }

      let desiredPageNumber = currentPage.pageNumber + offset;

      // Is the next page within this chapter?
      if (
        chapter.firstPage <= desiredPageNumber
        && chapter.lastPage >= desiredPageNumber
      ) {
        console.debug('going to page:',currentPage.chapterNumber, desiredPageNumber);
        this.goToPage(currentPage.chapterNumber, desiredPageNumber);

        // Is there a next chapter?
      } else if (chapter.nextChapter) {
        console.debug('Detected that we should go to next chapter')

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
