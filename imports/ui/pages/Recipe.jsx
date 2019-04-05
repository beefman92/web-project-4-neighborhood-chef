import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import NavigationBar from "../components/NavigationBar";
import { Recipes } from "../../api/recipes";
import { RecipeComments} from "../../api/recipe-comments";
import { Breadcrumb, Row, Col } from "react-bootstrap";

class Recipe extends Component {
	constructor(props) {
		super(props);
	}

	renderBreadcrumbs() {
		return (
			<Breadcrumb className={"my-3"}>
				<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
				<Breadcrumb.Item active>Recipe</Breadcrumb.Item>
			</Breadcrumb>
		);
	}

	renderRecipe() {
		return (
			<Row>
				<Col lg={"8"}>
					<img src={this.props.recipe.picture} alt={this.props.recipe.name} />
				</Col>
				<Col lg={"4"}>
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
				</Col>
			</Row>
		);
	}

	renderComments() {
		return (
			<Row>
				Comments
			</Row>
		);
	}

	render() {
		return (
			<div>
				<NavigationBar />
				{this.renderBreadcrumbs()}
				<hr/>
				{this.renderRecipe()}
				<hr/>
				{this.renderComments()}
			</div>
		);
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
};

export default withTracker((props) => {
	Meteor.subscribe("recipe", props.match.params.recipeId);
	Meteor.subscribe("recipeComments", props.match.params.recipeId);
	return {
		recipe: Recipes.findOne({_id: props.match.params.recipeId}),
		recipeComments: RecipeComments.find({recipe_id: props.match.params.recipeId}),
	};
})(Recipe);