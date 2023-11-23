

export type ComicChapter = {
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
