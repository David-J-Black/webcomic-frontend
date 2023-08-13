import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebcomicPageComponent } from './components/webcomic-page/webcomic-page.component';
import {PageService} from "./service/page.service";
import {NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    WebcomicPageComponent,
    SettingsMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule
  ],
  providers: [
    PageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
