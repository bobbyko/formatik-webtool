import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, FormBuilder } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { App } from "./app";
import { InstaFormatikCmp } from "./insta-formatik/components/insta-formatik-cmp";
import { InstaFormatikRouting } from "./insta-formatik/components/insta-formatik-route";
import { InstaFormatikService } from "./insta-formatik/services/insta-formatik-service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InstaFormatikRouting
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
