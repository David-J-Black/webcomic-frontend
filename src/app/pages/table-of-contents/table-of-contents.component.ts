import {Component, OnInit} from '@angular/core';
import {ChapterService} from "../../service/chapter.service";
import {NavigationService} from "../../service/navigation.service";

export class TableOfContentsPage {
  description: string;
  pageNumber: number;
  releaseDate: Date;
}
export class TableOfContentsChapter {
    title: string;
    chapterNumber: number;
    description: string;
    pages: TableOfContentsPage[];

}

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss']
})
export class TableOfContentsComponent implements OnInit {

  tableOfContents: TableOfContentsChapter[] = [];
  constructor(
      private _pageService: ChapterService,
      private _navService: NavigationService
  ) {}
  ngOnInit() {
    this._pageService.getTableOfContents().subscribe(response => {
      this.tableOfContents = response;
      console.debug('tableOfContents', response)
    });
  }

  jsonify(object: any): string {
    return JSON.stringify(object, null, 2);
  }

  goToPage(chapter: TableOfContentsChapter, page: TableOfContentsPage) {
    console.debug('Click Event', chapter, page);
    this._navService.goToInfiniteScrollPage(chapter.chapterNumber, page.pageNumber);
  }
}
