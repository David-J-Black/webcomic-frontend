import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ComicChapter, ComicPage} from "../objects/ComicChapter";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  env = environment;
  private urls = {
    getPageURL: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${chapterNumber}/${pageNumber}`,
    getPageLegacy: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${pageNumber}`,
    getChapterInfo: (chapterNumber: number) => `${environment.apiUrl}/chapter/${chapterNumber}`
  }

  constructor(
    private _http: HttpClient
  ) { }

  getPageURLs(chapterNumber, beginning, end): string[] {

    const response: string[] = []
    for(let i = beginning; i <= end; i++) {
      response.push(this.urls.getPageURL(chapterNumber, i));
    }
    return response;
  }

  /**
   * Get information for a range of pages
   * Todo: Make an endpoint on backend that gives a range of pages W chapter information
   * */
  getPages(chapter: number, beginning: number, end: number) {
    const response: ComicPage[] = [];

    /* For every page, we want to create a new page object with
     * with the correct information.
     * */
    for(let i = beginning; i <= end; i++) {

      const page = new ComicPage();
      page.pageNumber = i;
      page.url = this.urls.getPageURL(chapter, i);
      page.chapterNumber = chapter;
      response.push(page);
    }

    return response;
  }

  getChapterInfo(chapterNumber: number): Observable<ComicChapter> {
    return this._http.get<ComicChapter>(this.urls.getChapterInfo(chapterNumber))
  }

  /**
   * Fetch x number of pages that follow the given comicPage
   */
  getPagesFollowingPage(page: ComicPage, chapter: ComicChapter, numberOfPages: number): ComicPage[] {

    let numberOfPagesLeft = numberOfPages;

    if (chapter.number !== page.chapterNumber) {
      throw new Error('Chapter given to us does not match the page given to us!');
    }

    // 1: we evaulate how many pages are left in the chapter...

    // Are all the pages we want to fetch in this chapter contained within the chapter?
    const numberOfPagesFromThisChapter: number = page.pageNumber + numberOfPages <= chapter.lastPage ?
      numberOfPagesLeft :
      chapter.lastPage - page.pageNumber;

    // Get the pages we want to get from this chapter
    const pagesLeftInChapter: ComicPage[] = numberOfPagesFromThisChapter > 0 ?
      this.getPages(page.chapterNumber, page.pageNumber + 1, page.pageNumber + numberOfPagesFromThisChapter) :
      [];

    numberOfPagesLeft -= pagesLeftInChapter.length;

    if (numberOfPagesLeft <= 0 ||
        !chapter.nextChapter ||
        chapter.nextChapter.pageCount === 0) {
      return pagesLeftInChapter;
    }

    const pagesFromNextChapter: ComicPage[] = this.getPages(page.chapterNumber + 1, chapter.nextChapter.firstPage, chapter.nextChapter.firstPage + numberOfPagesLeft);
    return pagesLeftInChapter.concat(pagesFromNextChapter);

  }

  /**
   * Fetch x number of pages that preceed the given comicPage
   */
  getPagesPreceedingPage(page: ComicPage, chapter: ComicChapter, numberOfPages: number): ComicPage[] {

    let numberOfPagesLeft = numberOfPages;

    if (chapter.number !== page.chapterNumber) {
      throw new Error('Chapter given to us does not match the page given to us!');
    }

    // 1: we evaluate how many pages are left in the chapter...

    // Are all the pages we want to fetch in this chapter contained within the chapter?

    // Is the amount of pages we want from this chapter greater than the pages we have left?
    const numberOfPagesFromThisChapter: number = page.pageNumber - numberOfPages >= chapter.firstPage ?
      numberOfPagesLeft :
      page.pageNumber - chapter.firstPage;

    // Get the pages we want to get from this chapter
    const pagesLeftInChapter: ComicPage[] = numberOfPagesFromThisChapter > 0 ?
      this.getPages(page.chapterNumber, page.pageNumber - numberOfPagesFromThisChapter, page.pageNumber - 1) :
      [];

    numberOfPagesLeft -= pagesLeftInChapter.length;

    if (numberOfPagesLeft <= 0 || chapter.previousChapter === null || chapter.previousChapter.pageCount === 0) {
      return pagesLeftInChapter;
    }

    const pagesFromPreviousChapter: ComicPage[] = this.getPages(page.chapterNumber - 1, chapter.previousChapter.lastPage - numberOfPagesLeft, chapter.previousChapter.lastPage);

    return pagesFromPreviousChapter.concat(pagesLeftInChapter);

  }

}
