import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './root/app.component';
import { MenuComponent } from "./menu/menu.component";

@NgModule({
    imports:        [
        BrowserModule,
        AppRoutingModule
    ],
    declarations:   [ AppComponent, MenuComponent ],
    bootstrap:      [ AppComponent ]
})
export class AppModule { }