import {TableOfContentsPage} from "./TableOfContentsPage";

export type TableOfContentsChapter = {
  title: string;
  chapterNumber: number;
  description: string;
  pages: TableOfContentsPage[];
}
