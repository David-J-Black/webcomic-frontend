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
import { PageAboutComponent } from './pages/page-about/page-about.component';
import { PageExtrasComponent } from './pages/page-extras/page-extras.component';
import { CommentComponent } from './components/comment/comment.component';
import {DefaultApiInterceptor} from "./service/interrupter";
import { TableOfContentsComponent } from './pages/table-of-contents/table-of-contents.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SinglePageViewer,
    SettingsMenuComponent,
    SinglePageViewer,
    WebcomicInfiniteScrollComponent,
    ComicPageComponent,
    PageAboutComponent,
    PageExtrasComponent,
    CommentComponent,
    TableOfContentsComponent,
    CommentComponent,
    NavigationBarComponent,
  ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgOptimizedImage,
        MatIconModule,
        FormsModule
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
