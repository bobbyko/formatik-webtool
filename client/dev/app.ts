import { Component, OnInit } from "@angular/core";
import { Angulartics2Mixpanel } from "angulartics2";
import { CookieService } from 'ngx-cookie';
import { UUID } from 'angular2-uuid';

@Component({
	selector: "app",
	template: `
		<router-outlet></router-outlet>
	`
})
export class App implements OnInit {
	constructor(
		private angulartics2Mixpanel: Angulartics2Mixpanel,
		private cookieService: CookieService
	) { }

	ngOnInit(): void {
		let userId = this.cookieService.get("user-id");

		if (!userId) {
			userId = UUID.UUID();
			this.cookieService.put("user-id", userId);
		}

		this.angulartics2Mixpanel.setUsername(userId);
	}
}
