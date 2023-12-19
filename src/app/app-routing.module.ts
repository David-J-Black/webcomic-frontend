import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SinglePageViewer} from "./pages/single-page-viewer/single-page-viewer.component";
import {ComicReaderPage} from "./pages/page-comic-reader/page-of-comics.component";
import {PageAboutComponent} from "./pages/page-about/page-about.component";
import {TableOfContentsComponent} from "./pages/table-of-contents/table-of-contents.component";
import {PageExtrasComponent} from "./pages/page-extras/page-extras.component";
import {environment} from "../environments/environment";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: ":chapter/:page",
    component: ComicReaderPage,
  },
  {
    path: environment.routes.about,
    component: PageAboutComponent
  },
  {
    path: environment.routes.extras,
    component: PageExtrasComponent
  },
  {
    path: environment.routes.tableOfContents,
    component: TableOfContentsComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'infinite-scroll/1/1',
  //   pathMatch: "full"
  // },
  // {// If the path doesn't match anything else redirect to chapter 1
  //   path: '**',
  //   redirectTo: 'infinite-scroll/1/1'
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
