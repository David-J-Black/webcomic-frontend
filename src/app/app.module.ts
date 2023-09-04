import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebcomicPageComponent } from './components/webcomic-page/webcomic-page.component';
import {PageService} from "./service/page.service";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {RouterModule} from "@angular/router";
import {
  WebcomicInfiniteScrollComponent
} from "./components/webcomic-infinite-scroll/webcomic-infinite-scroll.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    WebcomicPageComponent,
    SettingsMenuComponent,
    WebcomicPageComponent,
    WebcomicInfiniteScrollComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    PageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
