import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Container, Grid, Button } from "semantic-ui-react";

import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";
import { Recipes } from "../../api/recipes";
import { RecipeComments } from "../../api/recipe-comments";
import "../style/recipe-page.css";

class Recipe extends Component {
	constructor(props) {
		super(props);
	}

	// renderBreadcrumbs() {
	// 	return (
	// 		<Breadcrumb className={"my-3"}>
	// 			<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
	// 			<Breadcrumb.Item active>Recipe</Breadcrumb.Item>
	// 		</Breadcrumb>
	// 	);
	// }

	handleOrderFood(event) {
		event.preventDefault();
		Meteor.call("shoppingCarts.addNewOne", this.props.recipe._id, (error) => {
			if (error === undefined || error === null) {
				// TODO: add some animation
			}
		});
	}

	renderRecipe() {
		return (
			<Grid.Row>
				<Grid.Column width={"8"}>
					<img className={"recipe-image"} src={this.props.recipe.picture} alt={this.props.recipe.name} />
				</Grid.Column>
				<Grid.Column width={"4"}>
					<div>
						{this.props.recipe.name}
					</div>
					<div>
						{this.props.recipe.content}
					</div>
					<div>
						{this.props.recipe.nutrition}
					</div>
					<div>
						{this.props.recipe.price}
					</div>
					<div>
						<Button color={"green"} onClick={(e) => this.handleOrderFood(e)}>Order</Button>
					</div>
				</Grid.Column>
			</Grid.Row>
		);
	}

	renderComments() {
		return (
			<Grid.Row>
				Comments
			</Grid.Row>
		);
	}

	render() {
		if (this.props.ready) {
			return (
				<div>
					<NavigationBar/>
					<ShoppingCart/>
					<Container>
						<Grid>
							{/*{this.renderBreadcrumbs()}*/}
							{/*<hr/>*/}
							{this.renderRecipe()}
							{/*<hr/>*/}
							{this.renderComments()}
						</Grid>
					</Container>
				</div>
			);
		} else {
			return (
				<div>
					<NavigationBar/>
					Loading...
				</div>
			);
		}
	}
}

Recipe.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			recipeId: PropTypes.string.isRequired,
		}),
	}),
	recipe: PropTypes.object,
	recipeComments: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker((props) => {
	const recipeHandler = Meteor.subscribe("recipe", props.match.params.recipeId);
	const recipeCommentsHandler = Meteor.subscribe("recipeComments", props.match.params.recipeId);
	const ready = recipeHandler.ready() && recipeCommentsHandler.ready();
	return {
		recipe: Recipes.findOne({_id: props.match.params.recipeId}),
		recipeComments: RecipeComments.find({recipe_id: props.match.params.recipeId}).fetch(),
		ready: ready,
	};
})(Recipe);