import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private scrollPosition = 0;

  env = environment;
  private urls = {
    getPage: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/page/${chapterNumber}/${pageNumber}`,
  }

  constructor(
    private _http: HttpClient
  ) { }

  setScrollPosition(position: number): void {
    this.scrollPosition = position;
  }

  getScrollPosition() :number {
    return this.scrollPosition;
  }

}
