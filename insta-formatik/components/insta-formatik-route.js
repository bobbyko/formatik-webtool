"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var insta_formatik_cmp_1 = require("../components/insta-formatik-cmp");
var instaFormatikRoutes = [
    {
        path: "",
        component: insta_formatik_cmp_1.InstaFormatikCmp,
        pathMatch: "full"
    }
];
exports.InstaFormatikRouting = router_1.RouterModule.forRoot(instaFormatikRoutes);
