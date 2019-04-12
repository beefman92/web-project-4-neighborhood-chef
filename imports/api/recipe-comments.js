import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const RecipeComments = new Mongo.Collection("recipe_comments");
export const RecipeCount = new Mongo.Collection("recipe_count");

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
			return RecipeCount.find({_id: {$in: recipeIds}}).fetch();
		}
	},
	"recipeComments.comment"(orderId, recipeIds, rating, comment) {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			return RecipeComments.update({order_id: orderId, recipe_id: {$in: recipeIds}},
				{$set: {comment: comment, rating: rating, comment_time: new Date()}});
		}
	}
});