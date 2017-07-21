import {
	Routes,
	RouterModule
} from "@angular/router";

import {
	InstaFormatikCmp
} from "../components/insta-formatik-cmp";

const instaFormatikRoutes:Routes = [
	{
		path: "",
		component: InstaFormatikCmp,
		pathMatch: "full"
	}
]

export const InstaFormatikRouting = RouterModule.forRoot(instaFormatikRoutes);
