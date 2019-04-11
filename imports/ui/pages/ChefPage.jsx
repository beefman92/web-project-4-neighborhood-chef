import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Grid, Card, Container } from "semantic-ui-react";

import { Chefs } from "../../api/chefs";
import { Recipes } from "../../api/recipes";
import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";
import "../style/chef-page.css";

class ChefPage extends Component {
	constructor(props) {
		super(props);
	}

	renderChefInfo() {
		if (this.props.ready === true) {
			return (
				<Grid.Row>
					<Grid.Column width={"16"}>
						<h2>Chef&#39;s introduction: </h2>
					</Grid.Column>
					<Grid.Column width={"4"}>
						<h3>{this.props.chefInfo.name}</h3>
					</Grid.Column>
					<Grid.Column width={"12"}>
						<div>{this.props.chefInfo.description}</div>
						<div>{this.props.chefInfo.address}</div>
						<div>{this.props.chefInfo.phone}</div>
					</Grid.Column>
				</Grid.Row>
			);
		} else {
			return (<Grid.Row><Grid.Column width={"16"}><p>Loading...</p></Grid.Column></Grid.Row>);
		}
	}

	renderRecipes() {
		// TODO: get orders number from server end.
		const recipes = this.props.recipes.map(recipe => {
			return (
				<Card key={recipe._id} color='orange'>
					<Card.Content>
						<Card.Header>
							<Link to={"/recipe/" + recipe._id}>
								{recipe.name}
							</Link>
						</Card.Header>
						<Card.Description>
							<Link to={"/recipe/" + recipe._id}>
								<img className={"recipe-list-image"} src={recipe.picture} alt={recipe.name} />
							</Link>
						</Card.Description>
					</Card.Content>
					<Card.Content extra>
						{"0 customers have ordered"}
					</Card.Content>
				</Card>
			);
		});
		return (
			<div>
				<Grid.Row>
					<Grid.Column width={"16"}>
						<h2>Recipes: </h2>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Card.Group>
						{recipes}
					</Card.Group>
				</Grid.Row>
			</div>
		);
	}

	renderBreadcrumbs() {
		// return (
		// 	<Breadcrumb className={"my-3"}>
		// 		<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
		// 		<Breadcrumb.Item active>Chef</Breadcrumb.Item>
		// 	</Breadcrumb>
		// );
	}

	render() {
		return (
			<div>
				<NavigationBar />
				<ShoppingCart chefId={this.props.match.params.chefId}/>
				<Container>
					<Grid divided>
						{this.renderBreadcrumbs()}
						{this.renderChefInfo()}
						{this.renderRecipes()}
					</Grid>
				</Container>
			</div>
		);
	}
}

ChefPage.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			chefId: PropTypes.string.isRequired,
		}),
	}),
	chefInfo: PropTypes.object,
	recipes: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker((props) => {
	const handler = Meteor.subscribe("chefInfo", props.match.params.chefId);
	const ready = handler.ready();
	Meteor.subscribe("chefRecipes", props.match.params.chefId);
	return {
		chefInfo: Chefs.findOne({_id: props.match.params.chefId}),
		recipes: Recipes.find({chef_id: props.match.params.chefId}).fetch(),
		ready: ready,
	};
})(ChefPage);