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
        this.evaluationInProgress = false;
    }
    InstaFormatikCmp.prototype.ngOnInit = function () {
    };
    InstaFormatikCmp.prototype.canEvaluate = function () {
        return !this.evaluationInProgress &&
            this.input && this.input != '' &&
            this.example && this.example != '';
    };
    InstaFormatikCmp.prototype.inputChanged = function () {
        this.inputCacheId = null;
        this.evaluation = null;
        this.processed = null;
        this.error = null;
        this.warning = null;
    };
    InstaFormatikCmp.prototype.exampleChanged = function () {
        this.evaluation = null;
        this.processed = null;
        this.error = null;
        this.warning = null;
    };
    InstaFormatikCmp.prototype.evaluate = function () {
        var _this = this;
        this.evaluationInProgress = true;
        this.error = null;
        this._instaFormatikService
            .evaluate(this.inputCacheId ? null : this.input, this.inputCacheId, this.example)
            .subscribe(function (evaluation) {
            _this.processed = null;
            if (evaluation.status === 'OK') {
                if (_this.inputCacheId != evaluation.inputCacheId)
                    _this.inputCacheId = evaluation.inputCacheId;
                _this.evaluation = evaluation;
                _this.process();
            }
            else {
                switch (evaluation.errorCode) {
                    case "InputCacheNotFound":
                        _this.inputCacheId = null;
                        _this.evaluate();
                        break;
                    default:
                        _this.evaluation = null;
                        _this.warning = evaluation.error;
                        _this.evaluationInProgress = false;
                        break;
                }
            }
        }, function (error) {
            _this.evaluation = null;
            _this.evaluationInProgress = false;
            _this.error = error;
        });
    };
    InstaFormatikCmp.prototype.process = function () {
        var _this = this;
        this.evaluationInProgress = true;
        this.error = null;
        this.warning = null;
        if (this.evaluation.formatId) {
            this._instaFormatikService
                .process(this.evaluation.formatId, this.inputCacheId ? null : this.input, this.inputCacheId)
                .subscribe(function (processed) {
                if (processed.status === 'OK') {
                    if (_this.inputCacheId != processed.inputCacheId)
                        _this.inputCacheId = processed.inputCacheId;
                    _this.evaluationInProgress = false;
                    _this.processed = processed;
                }
                else {
                    switch (processed.errorCode) {
                        case "InputCacheNotFound":
                            _this.inputCacheId = null;
                            _this.process();
                            break;
                        default:
                            _this.processed = null;
                            _this.evaluationInProgress = false;
                            _this.warning = processed.error;
                            break;
                    }
                }
            }, function (error) {
                _this.processed = null;
                _this.evaluationInProgress = false;
                _this.error = error;
            });
        }
        else {
            this.processed = null;
        }
    };
    InstaFormatikCmp.prototype.getProcessed = function () {
        return this.processed && this.processed.status === 'OK' ? this.processed.result : null;
    };
    return InstaFormatikCmp;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstaFormatikCmp.prototype, "input", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InstaFormatikCmp.prototype, "example", void 0);
InstaFormatikCmp = __decorate([
    core_1.Component({
        selector: "insta-formatik-cmp",
        templateUrl: "insta-formatik/templates/insta-formatik.html",
        styleUrls: ["insta-formatik/styles/insta-formatik.css"]
    }),
    __metadata("design:paramtypes", [insta_formatik_service_1.InstaFormatikService])
], InstaFormatikCmp);
exports.InstaFormatikCmp = InstaFormatikCmp;
