import {ComicChapter} from "./ComicChapter";

/**
 * Object representing a page in the comic, for use in the InfiniteScroll Component
 */
export class ComicPageSimple {
  pageNumber: number
  chapterNumber: number
  url: string

  // The height of the page relative to the current state of the webpage
  // this adjusts as the user scrolls and pages are added/ subtracted
  height: number;
  yPosition: number;

  /**
   * For getting the id used to reference a page as an HTML element
   */
  getPageId(): string {
    return this.chapterNumber + '_' + this.pageNumber
  }
}


/**
 * Includes more detailed page on the page, such as page description, and release date
 * TODO: Comment count
 */
export class ComicPageExtended {
  chapter: ComicChapter
  pageNumber: number
  chapterNumber: number
  url: string
  description: string
  releaseDate: Date
}
