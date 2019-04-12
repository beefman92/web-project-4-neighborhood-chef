import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import {Grid, Card, Container, Segment} from "semantic-ui-react";

import { Chefs } from "../../api/chefs";
import { Recipes } from "../../api/recipes";
import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";
import "../style/chef-page.css";

class ChefPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: {}
		};
	}

	renderChefInfo() {
		if (this.props.ready === true) {
			return (
				<Grid.Row divided>
					<Grid.Column width={"3"}>
						<img
							style={{width: "100px", borderRadius: "50%"}}
							src="https://st2.depositphotos.com/4908849/9632/v/950/depositphotos_96323190-stock-illustration-italian-chef-vector.jpg"
							alt="chef's profile picture"/>
					</Grid.Column>
					<Grid.Column width={"13"}>
						<Segment>
							<h2>{this.props.chefInfo.name}&#39;s Information</h2>
						</Segment>
						<Segment>
							{this.props.chefInfo.description}
						</Segment>
						<Segment>
							{"Address: " + this.props.chefInfo.address}
						</Segment>
						<Segment>
							{"Contact: " + this.props.chefInfo.phone}
						</Segment>
					</Grid.Column>
				</Grid.Row>
			);
		} else {
			return (<Grid.Row><Grid.Column width={"16"}><p>Loading...</p></Grid.Column></Grid.Row>);
		}
	}

	renderRecipes() {
		const recipes = this.props.recipes.map(recipe => {
			let orderCount = this.state.count[recipe._id];
			if (orderCount === undefined || orderCount === null) {
				orderCount = 0;
			}
			return (
				<Card key={recipe._id} color="orange">
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
						{orderCount > 1 ?  orderCount + " customers have ordered" : orderCount + " customer has ordered"}
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

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.ready && nextProps.recipes.length > 0) {
			const recipeIds = [];
			for (let i = 0; i < nextProps.recipes.length; i++) {
				recipeIds.push(nextProps.recipes[i]._id);
			}
			Meteor.call("recipeComments.getNumberOfOrders", recipeIds, (error, result) => {
				const countObject = {};
				result.forEach(value => {
					countObject[value._id] = value.finished_count;
				});
				this.setState({
					count: countObject,
				});
			});
		}
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