/**
 * Such a simple concept, but necessary for clean code I think
 */

export class ComicIndex {
    chapterNumber: number;
    pageNumber: number;

    constructor(chapterNumber: number, pageNumber: number) {
        this.chapterNumber = chapterNumber;
        this.pageNumber = pageNumber;
    }
}
