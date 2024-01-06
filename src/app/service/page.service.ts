import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {ComicChapter} from "../objects/ComicChapter";
import {ComicPageExtended, ComicPageSimple} from "../objects/ComicPage";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {TableOfContentsChapter} from "../objects/TableOfContentsChapter";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  env = environment;
  private urls = {
    getPageImage: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${chapterNumber}/${pageNumber}`,
    getPageInfo: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/pageInfo/${chapterNumber}/${pageNumber}`,
    getFirstPage:`${environment.apiUrl}/pages/first`,
    getLastPage:`${environment.apiUrl}/pages/last`,
    getChapterInfo: (chapterNumber: number) => `${environment.apiUrl}/chapter/${chapterNumber}`,
    getAllChapters: `${environment.apiUrl}/chapter/all`
  }

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _location: Location
  ) { }

  getPageInfo(chapterNumber: number, pageNumber: number): Observable<ComicPageExtended> {
    if (pageNumber === null || chapterNumber === null) {
      console.warn(`Null page or chapter number given pageNumber:${pageNumber}, chapterNumber:${chapterNumber}]`)
      return new Observable<ComicPageExtended>();
    }
    return this._http.get<ComicPageExtended>(this.urls.getPageInfo(chapterNumber, pageNumber));
  }

  getPageURL(chapter: number, pageNumber: number): string {
    return this.urls.getPageImage(chapter, pageNumber);
  }

  /**
   * Get information for a range of pages
   * Todo: Make an endpoint on backend that gives a range of pages W chapter information
   * */
  getPages(chapter: number, beginning: number, end: number): Observable<ComicPageSimple[]> {
    const response: ComicPageSimple[] = [];

    /*
     * For every page, we want to create a new page object with the correct information.
     */
    for(let i = beginning; i <= end; i++) {

      const page: ComicPageSimple = {
        pageNumber: i,
        url: this.urls.getPageImage(chapter, i),
        chapterNumber: chapter,
        height: undefined,
        yPosition: undefined
      };
      response.push(page);
    }

    console.debug('Retrieved pages', response);
    return of(response);
  }

  getChapterInfo(chapterNumber: number): Observable<ComicChapter> {
    return this._http.get<ComicChapter>(this.urls.getChapterInfo(chapterNumber))
  }

  /**
   * Fetch x number of pages that follow the given comicPage
   */
  getPageAfter(page: ComicPageSimple | ComicPageExtended, chapter: ComicChapter, numberOfPages: number): Observable<ComicPageSimple[]> {

    let numberOfPagesLeft = numberOfPages;

    if (chapter.number !== page.chapterNumber) {
      throw new Error('Chapter given to us does not match the page given to us!');
    }

    // 1: we evaulate how many pages are left in the chapter...

    // Are all the pages we want to fetch in this chapter contained within the chapter?
    const numberOfPagesFromThisChapter: number = page.pageNumber + numberOfPages <= chapter.lastPage ?
      numberOfPagesLeft :
      chapter.lastPage - page.pageNumber;

    return this.getPages(page.chapterNumber, page.pageNumber + 1, page.pageNumber + numberOfPagesFromThisChapter);
  }

  // /**
  //  * Fetch x number of pages that preceed the given comicPage
  //  */
  // getPageBefore(page: ComicPageSimple | ComicPageExtended, chapter: ComicChapter, numberOfPages: number): ComicPageSimple[] {
  //
  //   let numberOfPagesLeft = numberOfPages;
  //
  //   if (chapter.number !== page.chapterNumber) {
  //     throw new Error('Chapter given to us does not match the page given to us!');
  //   }
  //
  //   // 1: we evaluate how many pages are left in the chapter...
  //
  //   // Are all the pages we want to fetch in this chapter contained within the chapter?
  //
  //   // Is the amount of pages we want from this chapter greater than the pages we have left?
  //   const numberOfPagesFromThisChapter: number = page.pageNumber - numberOfPages >= chapter.firstPage ?
  //     numberOfPagesLeft :
  //     page.pageNumber - chapter.firstPage;
  //
  //   // Get the pages we want to get from this chapter
  //   const pagesLeftInChapter: ComicPageSimple[] = numberOfPagesFromThisChapter > 0 ?
  //     this.getPages(page.chapterNumber, page.pageNumber - numberOfPagesFromThisChapter, page.pageNumber - 1) :
  //     [];
  //
  //   numberOfPagesLeft -= pagesLeftInChapter.length;
  //
  //   if (numberOfPagesLeft <= 0 || chapter.previousChapter === null || chapter.previousChapter.pageCount === 0) {
  //     return pagesLeftInChapter;
  //   }
  //
  //   this.getPages(page.chapterNumber - 1, chapter.previousChapter.lastPage - numberOfPagesLeft, chapter.previousChapter.lastPage);
  //
  //   return pagesFromPreviousChapter.concat(pagesLeftInChapter);
  // }

  /**
   * Grab the first page from the API
   */
  getFirstPage(): Observable<ComicPageExtended> {
    return this._http.get<ComicPageExtended>(this.urls.getFirstPage);
  }

  /**
   * Grab the last page from the API
   */
  getLastPage(): Observable<ComicPageExtended> {
    return this._http.get<ComicPageExtended>(this.urls.getLastPage);
  }

  /**
   * Retrieve all the data needed for the table of contents
   */
  getTableOfContents(): Observable<TableOfContentsChapter[]> {
    return this._http.get<any>(this.urls.getAllChapters);
  }
}