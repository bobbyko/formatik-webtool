import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, FormBuilder } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { App } from "./app";
import { InstaFormatikCmp } from "./insta-formatik/components/insta-formatik-cmp";
import { InstaFormatikRouting } from "./insta-formatik/components/insta-formatik-route";
import { InstaFormatikService } from "./insta-formatik/services/insta-formatik-service";

// 3rd party modules
import { Angulartics2Module, Angulartics2Mixpanel } from "angulartics2";
import { CookieModule } from 'ngx-cookie';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InstaFormatikRouting,
    Angulartics2Module.forRoot([Angulartics2Mixpanel]),
    CookieModule.forRoot({ domain: "formatik.io" })
  ],
  declarations: [
    App,
    InstaFormatikCmp,
  ],
  providers: [
    InstaFormatikService,
  ],
  bootstrap: [
    App,
  ],
})
export class AppModule { }
