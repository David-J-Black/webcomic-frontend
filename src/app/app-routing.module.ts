import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WebcomicPageComponent} from "./components/webcomic-page/webcomic-page.component";

const routes: Routes = [

  {
    // path: "read/:chapter/:pageRange",
    path: "read/:chapter",
    component: WebcomicPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
