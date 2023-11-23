import {ComicChapter} from "./ComicChapter";

/**
 * Object representing a page in the comic, for use in the InfiniteScroll Component
 */
export type ComicPageSimple = {
  pageNumber: number
  chapterNumber: number
  url: string

  // The height of the page relative to the current state of the webpage
  // this adjusts as the user scrolls and pages are added/ subtracted
  height: number | undefined;
  yPosition: number | undefined;
}

/**
 * Includes more detailed page on the page, such as page description, and release date
 * TODO: Comment count
 */
export type ComicPageExtended = {
  chapter: ComicChapter
  pageNumber: number
  chapterNumber: number
  url: string
  description: string
  releaseDate: Date
}
