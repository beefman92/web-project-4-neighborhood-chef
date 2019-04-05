// import {Accounts} from "meteor/accounts-base";
//
// Accounts.validateNewUser(users => {
// 	const username = users.username;
// });

import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Accounts } from "meteor/accounts-base";



// Validate username, sending a specific error message on failure.



// export const UserInfo = new Mongo.Collection("users");

if (Meteor.isServer) {
    // Meteor.publish("PersonInfo", function personInfoPublish() {
	//     return UserInfo
    //         .find({_id: Meteor.userId()}, {
    //             limit: 20
    //         });
	// });
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