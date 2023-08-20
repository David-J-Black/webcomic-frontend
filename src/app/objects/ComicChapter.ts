
export enum PageState {
  notLoaded = 0,
  loaded = 1,
  error = 2
}

/**
 * I'm probs gonna throw this in the dumpster, but I'll keep the object here for now
 * Describes a range of pages that we would fetch from the backend
 */
export class ComicPage {
  pageNumber: number
  chapterNumber: number
  url: string

  height: number;
  yPosition: number;

  /**
   * For getting the id used to reference a page as an HTML element
   */
  getPageId(): string {
    return this.chapterNumber + '_' + this.pageNumber
  }

}

export class ComicChapter {
  description: string
  firstPage: number
  lastPage: number
  nextChapter: ComicChapter
  previousChapter: ComicChapter

  // Chapter Number
  number: number

  pageCount: number
  releaseDate: Date
  title: string
}
