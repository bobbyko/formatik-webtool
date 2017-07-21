"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var angular2_uuid_1 = require("angular2-uuid");
require("rxjs/add/operator/map");
var InstaFormatikService = InstaFormatikService_1 = (function () {
    function InstaFormatikService(_http) {
        this._http = _http;
    }
    InstaFormatikService.prototype.evaluate = function (input, inputCacheId, example) {
        return this._http
            .post(InstaFormatikService_1.ENDPOINT + "/" + InstaFormatikService_1.apiUserId + "/evaluate", {
            name: "Webtool request " + InstaFormatikService_1.sessionId,
            input: input,
            inputCacheId: inputCacheId,
            example: example,
            temporary: true
        })
            .map(function (r) { return r.json(); });
    };
    InstaFormatikService.prototype.process = function (formatId, input, inputCacheId) {
        return this._http
            .post(InstaFormatikService_1.ENDPOINT + "/" + InstaFormatikService_1.apiUserId + "/" + formatId, {
            input: input,
            inputCacheId: inputCacheId
        })
            .map(function (r) { return r.json(); });
    };
    return InstaFormatikService;
}());
InstaFormatikService.sessionId = angular2_uuid_1.UUID.UUID();
//static ENDPOINT: string = "http://107.170.236.236/api/v0.1";
InstaFormatikService.ENDPOINT = "http://localhost:5000/api/v0.1";
InstaFormatikService.apiUserId = "59092f5f99da28278a6ea211";
InstaFormatikService = InstaFormatikService_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(http_1.Http)),
    __metadata("design:paramtypes", [http_1.Http])
], InstaFormatikService);
exports.InstaFormatikService = InstaFormatikService;
var InstaFormatikService_1;
