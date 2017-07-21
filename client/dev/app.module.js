"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var app_1 = require("./app");
var insta_formatik_cmp_1 = require("./insta-formatik/components/insta-formatik-cmp");
var insta_formatik_route_1 = require("./insta-formatik/components/insta-formatik-route");
var insta_formatik_service_1 = require("./insta-formatik/services/insta-formatik-service");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                insta_formatik_route_1.InstaFormatikRouting
            ],
            declarations: [
                app_1.App,
                insta_formatik_cmp_1.InstaFormatikCmp,
            ],
            providers: [
                insta_formatik_service_1.InstaFormatikService,
            ],
            bootstrap: [
                app_1.App,
            ],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
