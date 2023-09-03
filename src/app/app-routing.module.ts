import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WebcomicPageComponent} from "./components/webcomic-page/webcomic-page.component";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: "read/:chapter/:page",
    component: WebcomicPageComponent
  },
  {
    path: '',
    redirectTo: 'read/1/1',
    pathMatch: "full"
  },
  {// If the path doesn't match anything else redirect to chapter 1
    path: '**',
    redirectTo: 'read/1/1'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
