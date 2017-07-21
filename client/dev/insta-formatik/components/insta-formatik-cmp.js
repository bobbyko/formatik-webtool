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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var insta_formatik_service_1 = require("../services/insta-formatik-service");
var InstaFormatikCmp = (function () {
    function InstaFormatikCmp(_instaFormatikService) {
        this._instaFormatikService = _instaFormatikService;
    }
    InstaFormatikCmp.prototype.ngOnInit = function () {
    };
    InstaFormatikCmp.prototype.evaluate = function () {
        var _this = this;
        this._instaFormatikService
            .evaluate(this.input, this.inputCacheId, this.example)
            .subscribe(function (evaluateResult) {
            _this.evaluation = evaluateResult;
            if (_this.inputCacheId != evaluateResult.inputCacheId)
                _this.inputCacheId = evaluateResult.inputCacheId;
        });
    };
    InstaFormatikCmp.prototype.process = function () {
        var _this = this;
        this._instaFormatikService
            .process(this.evaluation.formatId, this.input, this.inputCacheId)
            .subscribe(function (processed) {
            _this.processed = processed;
        });
    };
    return InstaFormatikCmp;
}());
InstaFormatikCmp = __decorate([
    core_1.Component({
        selector: "insta-formatik-cmp",
        templateUrl: "insta-formatik/templates/insta-formatik.html",
        styleUrls: ["insta-formatik/styles/insta-formatik.css"]
    }),
    __metadata("design:paramtypes", [insta_formatik_service_1.InstaFormatikService])
], InstaFormatikCmp);
exports.InstaFormatikCmp = InstaFormatikCmp;
