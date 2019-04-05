import {Meteor} from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { Accounts } from "meteor/accounts-base";

if (Meteor.isServer) {
	Accounts.validateNewUser(user => {
		const username = user.username;
		const password = user.password;

		const userSchema = new SimpleSchema({
			username: {
				type: String,
				min: 1,
				max: 30
			},

			password: {
				type: String,
				regEx: SimpleSchema.RegEx.password
			}
		});

		userSchema.validate({
			username: username,
			password: password
		});

		return true;
	});
}