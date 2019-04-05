import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const RecipeComments = new Mongo.Collection("recipe_comments");

if (Meteor.isServer) {
	Meteor.publish("recipeComments", function(recipeId) {
		return RecipeComments.find({recipe_id: recipeId});
	});
}