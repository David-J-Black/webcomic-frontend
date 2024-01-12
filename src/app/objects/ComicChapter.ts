import {ComicPageSimple} from "./ComicPage";


export type ComicChapter = {
  chapterNumber: number
  title: string
  releaseDate: Date
  description: string
  firstPage: number
  lastPage: number
  pageCount: number

  // These two will be null in the case of fetching ALL chapters
  nextChapter: ComicChapter | undefined
  previousChapter: ComicChapter | undefined

  // This will be null in most cases, unless we fetching ALL chapters
  pages: ComicPageSimple | undefined;
}
