import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Container, Grid, Button, Segment } from "semantic-ui-react";
import $ from "jquery";

import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";
import { Recipes } from "../../api/recipes";
import { RecipeComments } from "../../api/comments";
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
		const id = "dish" + Date.now();
		const element = "<img id='" + id + "' class='fly-dish' src='/images/dish.svg' alt='dish icon'/>";
		const buttonRect = document.getElementById("orderButton").getBoundingClientRect();
		const cartRect = document.getElementById("shoppingCartDiv").getBoundingClientRect();
		const startPosition = {
			left: buttonRect.x + buttonRect.width / 2,
			top: buttonRect.y,
		};
		const endPosition = {
			left: cartRect.x,
			top: cartRect.y,
		};
		Meteor.call("shoppingCarts.addNewOne", this.props.recipe._id, (error) => {
			if (error === undefined || error === null) {
				$("#orderButton").append(element);
				const imgElement = $("#" + id);
				imgElement.css({"position": "fixed", "left": startPosition.left, "top": startPosition.top});
				imgElement.animate({
					left: endPosition.left,
					top: endPosition.top,
				}, {
					duration: 700,
					complete: function() {
						imgElement.remove();
					}
				});
			}
		});
	}

	renderRecipe() {
		return (
			<Grid.Row>
				<Grid.Column width={"8"}>
					<img className={"recipe-image"} src={this.props.recipe.picture} alt={this.props.recipe.name} />
				</Grid.Column>
				<Grid.Column width={"8"}>
					<Segment>
						<h1>{this.props.recipe.name}</h1>
					</Segment>
					<Segment>
						<div>Ingredients: {this.props.recipe.content}</div>
						<div>Nutrition: {this.props.recipe.nutrition}</div>
						<div>Price: {this.props.recipe.price}$</div>
					</Segment>
					<Segment textAlign={"right"}>
						<Button id={"orderButton"} onClick={(e) => this.handleOrderFood(e)} positive>Order</Button>
					</Segment>
				</Grid.Column>
			</Grid.Row>
		);
	}

	renderComments() {
		const comments = this.props.recipeComments.map(value => {
			return (
				<Grid.Row key={value._id}>
					<Grid.Column width={"16"}>
						<Segment.Group>
							<Segment style={{display: "flex"}}>
								<div style={{flex: "30%"}}>
									User: {value.customer_id}
								</div>
								<div style={{flex: "40%"}}>
									Rating: {value.rating}
								</div>
								<div style={{flex: "30%"}}>
									Time: {value.create_time.toLocaleString("en-US")}
								</div>
							</Segment>
							<Segment>
								Comments: {value.comment}
							</Segment>
						</Segment.Group>
					</Grid.Column>
				</Grid.Row>
			);
		});
		return (
			comments
		);
	}

	render() {
		const chefId = this.props.recipe !== undefined && this.props.recipe !== null ? this.props.recipe.chef_id : "";
		if (this.props.ready) {
			return (
				<div>
					<NavigationBar/>
					<ShoppingCart chefId={chefId}/>
					<Container>
						<Grid>
							{/*{this.renderBreadcrumbs()}*/}
							{/*<hr/>*/}
							{this.renderRecipe()}
							{/*<hr/>*/}
							<Grid.Row>
								<Grid.Column width={"16"}>
									<h2>Comments</h2>
								</Grid.Column>
							</Grid.Row>
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
		recipeComments: RecipeComments.find({recipe_id: props.match.params.recipeId}, {sort: {create_time: -1}}).fetch(),
		ready: ready,
	};
})(Recipe);