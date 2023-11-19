import {Component, OnInit} from '@angular/core';
import {ComicChapter} from "../../objects/ComicChapter";
import {ChapterService} from "../../service/chapter.service";
import {Observable} from "rxjs";

class TableOfContentsPage {
  description: string;
  pageNumber: number;
  releaseDate: Date;
}
class TableOfContentsChapter {

    chapterNumber: number;
    pages: TableOfContentsPage[];

}

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class TableOfContentsComponent implements OnInit {

  comicChapters: TableOfContentsChapter[] | undefined;
  tableOfContents: Map<number, TableOfContentsChapter> | undefined;
  constructor(
      private _pageService: ChapterService
  ) {}
  ngOnInit() {
    this._pageService.getTableOfContents().subscribe(response => {
      this.tableOfContents = response;
      console.info('tableOfContents', response)
    });
  }

  jsonify(object: any): string {
    return JSON.stringify(object, null, 2);
  }

  getChapters(): TableOfContentsChapter[] {
    const response: TableOfContentsChapter[] = [];
    for( const chapter of this.comicChapters) {
      chapter;
    }
    return  response;
  }
}
