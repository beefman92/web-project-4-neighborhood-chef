import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { WebApp } from "meteor/webapp";

import "../imports/api/chefs";
import "../imports/api/recipes";
import "../imports/api/recipe-comments";
import "../imports/api/shopping-carts";

if (Meteor.isServer) {
	const rule = {
		name() {
			return true;
		},
		type() {
			return true;
		},
	};
	DDPRateLimiter.addRule(rule, 10, 1000);
	WebApp.addHtmlAttributeHook(() => ({ lang: "en" }));
}

Meteor.startup(() => {
});
