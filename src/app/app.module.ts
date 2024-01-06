import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PageService} from "./service/page.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import {RouterModule} from "@angular/router";
import {
  ComicReaderPage
} from "./pages/page-comic-reader/page-of-comics.component";
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
import { PageLostComponent } from './pages/page-lost/page-lost.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsMenuComponent,
    ComicReaderPage,
    ComicPageComponent,
    PageAboutComponent,
    PageExtrasComponent,
    CommentComponent,
    TableOfContentsComponent,
    CommentComponent,
    NavigationBarComponent,
    PageLostComponent,
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
    PageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
