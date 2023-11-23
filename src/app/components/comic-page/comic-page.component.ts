import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ComicPageExtended, ComicPageSimple} from "../../objects/ComicPage";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'cmc-comic-page',
  templateUrl: './comic-page.component.html',
  styleUrls: ['./comic-page.component.scss']
})
export class ComicPageComponent {

  @Input() comicPage: ComicPageSimple | ComicPageExtended | undefined;
  @Input() internalComments: boolean = false;
  @Output() load: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() error: EventEmitter<Event> = new EventEmitter<Event>();
  public _displayComments = () => {
    return this.internalComments && environment.commentsOn;
  }

  onLoad(event: Event) {
    this.load.emit(event);
  }

  onError(event: Event) {
    this.error.emit(event);
  }

}
