import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

export class Pagination {
  pageSize: number;
  pageNumber: number;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _http: HttpClient) {}

  env = environment;
  private urls = {
    getPageComments: (chapterNumber: number, pageNumber: number): string => `${environment.apiUrl}/comment/${chapterNumber}/${pageNumber}`,
  }

  getPageComments(chapterNumber: number, pageNumber: number, pagination: Pagination): Observable<any> {


    const params = new HttpParams()
      .set('pageSize', pagination.pageSize)
      .set('pageNumber', pagination.pageNumber)

    return this._http.get<any>(this.urls.getPageComments(chapterNumber, pageNumber), {params})
  }
}
