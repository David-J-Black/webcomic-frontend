import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ComicPageSimple} from "../../objects/ComicChapter";

@Component({
  selector: 'cmc-comic-page',
  templateUrl: './comic-page.component.html',
  styleUrls: ['./comic-page.component.scss']
})
export class ComicPageComponent {
  @Input() webComicPage: ComicPageSimple

  @Output() load: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() error: EventEmitter<Event> = new EventEmitter<Event>();

  onLoad(event: Event) {
    this.load.emit(event);
  }

  onError(event: Event) {
    this.error.emit(event);
  }
}
