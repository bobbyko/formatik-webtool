"use strict";
/// <reference path="../../../../typings/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var Observable_1 = require("rxjs/Observable");
var insta_formatik_cmp_1 = require("../../../../client/dev/insta-formatik/components/insta-formatik-cmp");
var insta_formatik_service_1 = require("../../../../client/dev/insta-formatik/services/insta-formatik-service");
var MockTodoService = (function (_super) {
    __extends(MockTodoService, _super);
    function MockTodoService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockTodoService.prototype.getAll = function () {
        return new Observable_1.Observable(function (o) {
            o.next([]);
        });
    };
    MockTodoService.prototype.add = function (message) {
        return new Observable_1.Observable(function (o) {
            o.next(message);
        });
    };
    MockTodoService.prototype.remove = function (id) {
        return new Observable_1.Observable(function (o) {
            o.next(id);
        });
    };
    return MockTodoService;
}(insta_formatik_service_1.InstaFormatikService));
describe("todo_component", function () {
    describe("creation", function () {
        it("should create the component correctly", testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(insta_formatik_cmp_1.InstaFormatikCmp);
            fixture.detectChanges();
            var compiled = fixture.debugElement.nativeElement;
            expect(compiled).toBeDefined();
        }));
        it("should inicialize the cmp correctly", testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(insta_formatik_cmp_1.InstaFormatikCmp);
            var instance = fixture.debugElement.componentInstance;
            spyOn(instance, "_getAll").and.callFake(function () { });
            fixture.detectChanges();
            expect(instance._getAll).toHaveBeenCalled();
        }));
        it("should call add correctly", testing_1.async(function () {
            var fixture = testing_1.TestBed.createComponent(insta_formatik_cmp_1.InstaFormatikCmp);
            fixture.detectChanges();
            var instance = fixture.debugElement.componentInstance;
            // let _todoMsg = "yo";
            // instance.add(_todoMsg);
            // }));
            // it("should call remove correctly", async(() => {
            //   let fixture = TestBed.createComponent(InstaFormatikCmp);
            // fixture.detectChanges();
            // let instance = fixture.debugElement.componentInstance;
            // let _id = "abc123";
            // instance.remove(_id);
        }));
    });
});
