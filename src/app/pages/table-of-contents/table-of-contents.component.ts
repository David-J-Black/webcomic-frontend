import {Component, OnInit} from '@angular/core';
import {ChapterService} from "../../service/chapter.service";
import {NavigationService} from "../../service/navigation.service";
import {TableOfContentsChapter} from "../../objects/TableOfContentsChapter";
import {TableOfContentsPage} from "../../objects/TableOfContentsPage";


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


  goToPage(chapter: TableOfContentsChapter, page: TableOfContentsPage) {
    console.debug('Click Event', chapter, page);
    this._navService.goToInfiniteScrollPage(chapter.chapterNumber, page.pageNumber);
  }
}
