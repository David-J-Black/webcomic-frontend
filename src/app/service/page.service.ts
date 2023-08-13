import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ComicPage, PageRange} from "../components/webcomic-page/webcomic-page.component";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  env = environment;
  private urls = {
    getPage: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${chapterNumber}/${pageNumber}`,
    getPageLegacy: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${pageNumber}`,
    getChapterInfo: (chapterNumber: number) => `${environment.apiUrl}/chapter/${chapterNumber}`
  }

  constructor(
    private _http: HttpClient
  ) { }

  getPageURL(chapter: number, page: number): string {
    return this.urls.getPage(chapter, page);
  }

  getPageURLs(chapterNumber, beginning, end): string[] {

    const response: string[] = []
    for(let i = beginning; i <= end; i++) {
      response.push(this.urls.getPage(chapterNumber, i));
    }
    return response;
  }

  getChapterInfo(chapterNumber: number): Observable<any> {
    return this._http.get(this.urls.getChapterInfo(chapterNumber))
  }

  /**
   * Return a range of pages, along with all the urls needed
   * @param chapter Which chapter number?
   * @param page Which page is in the middle?
   * @param delta How many pages before and after the current page do we want to load?
   */
  // getPages( chapter: number, page: number, delta: number): ComicPage[] {
  //
  //   // We don't want to load pages that don't exist so we're going to do two steps
  //
  //   // 1: Get the number of pages in this chapter
  //   // - The first page is not necessarily page 1 either! I want to include intro pages that might be like page 0 or page -1.
  //
  // }

}
