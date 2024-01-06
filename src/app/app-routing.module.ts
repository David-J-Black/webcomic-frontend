import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComicReaderPage} from "./pages/page-comic-reader/page-of-comics.component";
import {PageAboutComponent} from "./pages/page-about/page-about.component";
import {TableOfContentsComponent} from "./pages/table-of-contents/table-of-contents.component";
import {PageExtrasComponent} from "./pages/page-extras/page-extras.component";
import {PageLostComponent} from "./pages/page-lost/page-lost.component";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: ":chapter/:page",
    component: ComicReaderPage,
  },
  {
    path: 'about',
    title: 'Finding Darwin: About',
    component: PageAboutComponent
  },
  {
    path: 'extras',
    title: 'Finding Darwin: Extras',
    component: PageExtrasComponent,
  },
  {
    path: 'table-o-contents',
    title: 'Finding Darwin: Table of Contents',
    component: TableOfContentsComponent
  },
  {
    path: 'lost',
    title: 'Finding Darwin: You are Lost!',
    component: PageLostComponent
  },
  {
    path: '',
    redirectTo: '/1/1',
    pathMatch: "full"
  },
  {// If the path doesn't match anything else redirect to chapter 1
    path: '**',
    redirectTo: '/1/1'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
