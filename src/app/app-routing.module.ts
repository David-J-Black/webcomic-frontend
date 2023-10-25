import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SinglePageViewer} from "./components/single-page-viewer/single-page-viewer.component";
import {WebcomicInfiniteScrollComponent} from "./components/webcomic-infinite-scroll/webcomic-infinite-scroll.component";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: "infinite-scroll/:chapter/:page",
    component: WebcomicInfiniteScrollComponent
  },
  {
    // path: "read/:chapter/:pageRange",
    path: "page/:chapter/:page",
    component: SinglePageViewer
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
