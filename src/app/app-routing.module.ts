import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SinglePageViewer} from "./pages/single-page-viewer/single-page-viewer.component";
import {WebcomicInfiniteScrollComponent} from "./pages/webcomic-infinite-scroll/webcomic-infinite-scroll.component";
import {PageAboutComponent} from "./pages/page-about/page-about.component";
import {TableOfContentsComponent} from "./pages/table-of-contents/table-of-contents.component";
import {PageExtrasComponent} from "./pages/page-extras/page-extras.component";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: "infinite-scroll/:chapter/:page",
    component: WebcomicInfiniteScrollComponent,
  },
  {
    // path: "read/:chapter/:pageRange",
    path: "page/:chapter/:page",
    component: SinglePageViewer
  },
  {
    path: 'about',
    component: PageAboutComponent
  },
  {
    path: 'extras',
    component: PageExtrasComponent
  },
  {
    path: 'table-of-contents',
    component: TableOfContentsComponent
  },
  {
    path: '',
    redirectTo: 'infinite-scroll/1/1',
    pathMatch: "full"
  },
  {// If the path doesn't match anything else redirect to chapter 1
    path: '**',
    redirectTo: 'infinite-scroll/1/1'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
