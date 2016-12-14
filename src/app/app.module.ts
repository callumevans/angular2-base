import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './root/app.component';
import { TestComponent } from "./test/test.component";

@NgModule({
    imports:        [
        BrowserModule,
        AppRoutingModule
    ],
    declarations:   [ AppComponent, TestComponent ],
    bootstrap:      [ AppComponent ]
})
export class AppModule { }