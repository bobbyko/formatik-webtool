import {
  platformBrowserDynamic
} from "@angular/platform-browser-dynamic";

import {
  AppModule
} from "./app.module";

import { enableProdMode } from '@angular/core';

if ("{{ENV}}" === "production")
  enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
