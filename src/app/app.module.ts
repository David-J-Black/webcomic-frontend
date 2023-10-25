import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SinglePageViewer } from './components/single-page-viewer/single-page-viewer.component';
import {PageService} from "./service/page.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import {RouterModule} from "@angular/router";
import {
  WebcomicInfiniteScrollComponent
} from "./components/webcomic-infinite-scroll/webcomic-infinite-scroll.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComicPageComponent } from './components/comic-page/comic-page.component';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ExtrasPageComponent } from './components/extras-page/extras-page.component';
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
  declarations: [
    AppComponent,
    SinglePageViewer,
    SettingsMenuComponent,
    SinglePageViewer,
    WebcomicInfiniteScrollComponent,
    ComicPageComponent,
    AboutPageComponent,
    ExtrasPageComponent,
    CommentComponent,
  ],
    imports: [
      BrowserModule,
      CommonModule,
      AppRoutingModule,
      RouterModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgOptimizedImage,
      MatIconModule
    ],
  providers: [
    PageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
