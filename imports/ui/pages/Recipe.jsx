import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Container, Grid, Button, Segment } from "semantic-ui-react";
import $ from "jquery";

import NavigationBar from "../components/NavigationBar";
import SearchBar from "../components/SearchBar";
import ShoppingCart from "../components/ShoppingCart";
import { Recipes } from "../../api/recipes";
import { RecipeComments } from "../../api/comments";
import WebsiteIndex from "../components/WebsiteIndex";
import "../style/recipe-page.css";
import Footer from "../components/Footer";

class Recipe extends Component {
	constructor(props) {
		super(props);
	}

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

	handleSearch(event, data) {
		event.preventDefault();
		if (data.find && data.near) {
			this.props.history.push("/search", {...data});
		}
	}

	render() {
		const chefId = this.props.recipe !== undefined && this.props.recipe !== null ? this.props.recipe.chef_id : "";
		if (this.props.ready) {
			const sections = [
				{key: "Home", content: "Home", link: true, href: "/"},
				{key: "Search", content: "Search", link: true, href: "/search"},
				{key: "Chef", content: "Chef", link: true, href: "/chef/" + this.props.recipe.chef_id},
				{key: "Recipe", content: "Recipe", link: false, active: true},
			];
			return (
				<div>
					<NavigationBar/>
					<ShoppingCart chefId={chefId}/>
					<Container>
						<Grid>
							<SearchBar onSubmit={(e, d) => this.handleSearch(e, d)}/>
							<WebsiteIndex sections={sections}/>
							{this.renderRecipe()}
							<Grid.Row>
								<Grid.Column width={"16"}>
									<h2>Comments</h2>
								</Grid.Column>
							</Grid.Row>
							{this.renderComments()}
						</Grid>
					</Container>
					<Footer/>
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
	history: PropTypes.object,
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