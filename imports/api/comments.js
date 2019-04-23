import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

import { Orders } from "./orders";
import { HAS_COMMENT } from "./order-status";

export const RecipeComments = new Mongo.Collection("recipe_comments");
export const ChefComments = new Mongo.Collection("chef_comments");

if (Meteor.isServer) {
	Meteor.publish("recipeComments", function(recipeId) {
		return RecipeComments.find({recipe_id: recipeId});
	});
}

Meteor.methods({
	"recipeComments.getNumberOfOrders"(recipeIds) {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}

			const option = [{
				$match: {recipe_id: {$in: recipeIds}},
			}, {
				$group: {_id: "$recipe_id", count: {$sum: 1}}
			}];
			return RecipeComments.rawCollection().aggregate(option).toArray();
		}
	},
	"comments.leaveComments"(recipeComments, chefComment) {
		check(recipeComments, Array);
		check(chefComment, Object);

		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const commentTime = new Date();
			recipeComments.forEach((value) => {
				RecipeComments.update(
					{order_id: value.orderId, recipe_id: value.recipeId},
					{$set: {comment: value.comment, rating: value.rating, comment_time: commentTime}})	;
			});
			ChefComments.update(
				{order_id: chefComment.orderId},
				{$set: {comment: chefComment.comment, rating: chefComment.rating, comment_time: commentTime}});
			return Orders.update({_id: chefComment.orderId}, {$set: {comment_status: HAS_COMMENT}});
		}
	}
});