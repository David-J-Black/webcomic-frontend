import {Component, Input, OnInit} from '@angular/core';
import {jsonify} from 'src/app/utils'
import {ComicPageExtended, ComicPageSimple} from "../../objects/ComicPage";
import {CommentService} from "../../service/comment.service";
import {ComicComment} from "../../objects/ComicComment";
import {Pagination} from "../../objects/Pagination";

@Component({
  selector: 'cmc-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{
  constructor(
      private _commentService: CommentService
  ) {
  }

  @Input() comicPage: ComicPageSimple | ComicPageExtended | undefined;
  comments: ComicComment[] = []

  jsonify(obj: any) {
    return jsonify(obj);
  }

  ngOnInit(): void {
    const pagination: Pagination = {
      pageSize: 20,
      pageNumber: 0
    }

    if (this.comicPage !== undefined) {
      this._commentService.getPageComments(this.comicPage.chapterNumber, this.comicPage.pageNumber, pagination)
          .subscribe( (response: ComicComment[]) => {
            console.log('comments', response)
            this.comments = response;
          })
    } else {
      console.error('HEY! YOU SHOULD DEFINITELY GIVE THIS ELEMENT A comicPage OBJECT!');
    }
  }
}
