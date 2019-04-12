import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";

if (Meteor.isServer) {
	// Accounts.validateNewUser(user => {
	// 	const username = user.username;
	// 	const password = user.password;
	//
	// 	const userSchema = new SimpleSchema({
	// 		username: {
	// 			type: String,
	// 			min: 1,
	// 			max: 30
	// 		},
	//
	// 		password: {
	// 			type: String,
	// 			regEx: SimpleSchema.RegEx.password
	// 		}
	// 	});
	//
	// 	userSchema.validate({
	// 		username: username,
	// 		password: password
	// 	});
	//
	// 	return true;
	// });
}

Meteor.methods({
	"users.updateProfile"(username, newProfile) {
		check(username, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		if (Meteor.isServer) {
			return Meteor.users.update({_id: Meteor.userId()},
				{$set: {username: username, profile: newProfile}});
		}
	}
})