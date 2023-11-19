import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SinglePageViewer } from './pages/single-page-viewer/single-page-viewer.component';
import {ChapterService} from "./service/chapter.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import {RouterModule} from "@angular/router";
import {
  WebcomicInfiniteScrollComponent
} from "./pages/webcomic-infinite-scroll/webcomic-infinite-scroll.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComicPageComponent } from './components/comic-page/comic-page.component';
import {MatIconModule} from "@angular/material/icon";
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ExtrasPageComponent } from './pages/extras-page/extras-page.component';
import { CommentComponent } from './components/comment/comment.component';
import {DefaultApiInterceptor} from "./service/interrupter";
import { TableOfContentsComponent } from './pages/table-of-contents/table-of-contents.component';

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
    TableOfContentsComponent,
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
    ChapterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
