import React, { Component } from "react";
import NavigationBar from "../components/NavigationBar";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Row, Col, CardColumns, Card, Breadcrumb } from "react-bootstrap";

import { Chefs } from "../../api/chefs";
import { Recipes } from "../../api/recipes";

class ChefPage extends Component {
	constructor(props) {
		super(props);
	}

	renderChefInfo() {
		if (this.props.ready === true) {
			return (
				<div>
					<h2>Chef&#39;s introduction: </h2>
					<Row>
						<Col lg={"3"}>
							<h3>{this.props.chefInfo.name}</h3>
						</Col>
						<Col lg={"9"}>
							<div>{this.props.chefInfo.description}</div>
							<div>{this.props.chefInfo.address}</div>
							<div>{this.props.chefInfo.phone}</div>
						</Col>
					</Row>
				</div>
			);
		} else {
			return (<Row><Col lg={"12"}><p>Loading...</p></Col></Row>);
		}
	}

	renderRecipes() {
		// TODO: get orders number from server end.
		const recipes = this.props.recipes.map(recipe => {
			return (
				<Card key={recipe._id}>
					<Card.Header>
						<Card.Title>
							<Link to={"/recipe/" + recipe._id}>
								{recipe.name}
							</Link>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Link to={"/recipe/" + recipe._id}>
							<img src={recipe.picture} alt={recipe.name} />
						</Link>
					</Card.Body>
					<Card.Footer className="text-muted">
						{"0 customers have ordered"}
					</Card.Footer>
				</Card>
			);
		});
		return (
			<div>
				<h2>Recipes: </h2>
				<CardColumns>
					{recipes}
				</CardColumns>
			</div>
		);
	}

	renderBreadcrumbs() {
		return (
			<Breadcrumb className={"my-3"}>
				<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
				<Breadcrumb.Item active>Chef</Breadcrumb.Item>
			</Breadcrumb>
		);
	}

	render() {
		return (
			<div>
				<NavigationBar />
				{this.renderBreadcrumbs()}
				{this.renderChefInfo()}
				<hr/>
				{this.renderRecipes()}
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