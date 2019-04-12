import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Orders } from "../../api/orders";
import { Recipes } from "../../api/recipes";
import { NEW, ACCEPTED, READY, PICKED_UP, FINISHED, CANCELED, CANCELING} from "../../api/order-status";
import {Grid, Card, Icon, Segment, Button} from "semantic-ui-react";
import PropTypes from "prop-types";

class ChefOrderList extends Component {
	constructor(props) {
		super(props);
	}

	renderOrderList() {
		if (this.props.orders.length === 0) {
			return (
				<Grid.Row>
					<Grid.Column width={"16"}>
						<Segment style={{fontSize: "20px"}} textAlign={"center"}>
							Add more delicious cuisine to attract customers 😋.
						</Segment>
					</Grid.Column>
				</Grid.Row>
			);
		}
		return (
			this.props.orders.map(value => {
				return (
					<Grid.Row key={value._id}>
						<Grid.Column width={"16"}>
							<Card fluid color={"orange"}>
								<Card.Content>
									<Card.Header>
										<div className={"header-wrapper"}>
											<div className={"header-order-time"}>
												{value.create_time.toLocaleString("en-US")}
											</div>
											<div className={"header-order-id"}>
												{"Order id: " + value._id}
											</div>
											<div className={"header-delete-icon"}>
												<Icon link name={"trash"} onClick={() => this.handleDeleteOrder(value._id)}/>
											</div>
										</div>
									</Card.Header>
								</Card.Content>
								<Card.Content>
									<Grid divided>
										<Grid.Row>
											<Grid.Column width={"10"}>
												{this.renderRecipeList(value.recipes)}
											</Grid.Column>
											<Grid.Column textAlign={"center"} width={"2"}>
												{"$ " + this.computeSumPrice(value.recipes)}
											</Grid.Column>
											<Grid.Column textAlign={"center"} width={"2"}>
												{this.renderOrderStatus(value)}
											</Grid.Column>
											<Grid.Column textAlign={"center"} width={"2"}>
												{this.renderOperationButton(value)}
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</Card.Content>
								<Card.Content>
								</Card.Content>
							</Card>
						</Grid.Column>
					</Grid.Row>
				);
			})
		);
	}

	renderRecipeList(recipesInOrders) {
		return (
			<Segment.Group>
				{recipesInOrders.map(value => {
					const recipeInfo = this.props.recipes[value.recipe_id];
					return (
						<Segment className={"recipe-display-area"} key={value.recipe_id}>
							<div className={"recipe-picture-area"}>
								<img className={"order-picture"} src={recipeInfo.picture} alt={"picture of " + value.name} />
							</div>
							<div className={"recipe-description-area"}>
								{recipeInfo.name}
							</div>
							<div className={"recipe-count-area"}>
								{"" + value.count}
							</div>
							<div className={"recipe-price-area"}>
								{"$ " + value.price}
							</div>
						</Segment>
					);
				})}
			</Segment.Group>
		);
	}

	computeSumPrice(recipesInOrders) {
		let sum = 0;
		recipesInOrders.forEach(value => {
			sum += value.price;
		});
		return sum;
	}

	handleAcceptNewOrder(orderId) {
		Meteor.call("orders.chefAcceptOrder", orderId);
	}

	handleMealIsReady(orderId) {
		Meteor.call("orders.chefMealIsReady", orderId);
	}

	handleCancelOrder(orderId) {
		Meteor.call("orders.chefCancel", orderId);
	}

	handleConfirmCancelOrder(orderId) {
		Meteor.call("orders.chefConfirmCancel", orderId);
	}

	renderOperationButton(order) {
		switch(order.status) {
		case NEW:
			return (
				<div>
					<Button onClick={() => this.handleAcceptNewOrder(order._id)} positive>Accept</Button>
					<Button onClick={() => this.handleCancelOrder(order._id)} negative>Cancel</Button>
				</div>
			);
		case ACCEPTED:
			return (
				<Button onClick={() => this.handleMealIsReady(order._id)} positive>Ready</Button>
			);
		case READY:
			return (
				""
			);
		case PICKED_UP:
			return (
				""
			);
		case FINISHED:
			return (
				""
			);
		case CANCELING:
			return (
				<Button onClick={() => this.handleConfirmCancelOrder(order._id)} negative>Confirm Cancel</Button>
			);
		case CANCELED:
			return (
				""
			);
		}
	}

	renderOrderStatus(order) {
		switch(order.status) {
		case NEW:
			return (
				<p>New order is coming. Accept it ASAP.</p>
			);
		case ACCEPTED:
			return (
				<p>Waiting for meal ready...</p>
			);
		case READY:
			return (
				<p>Waiting for customer to pick up</p>
			);
		case PICKED_UP:
			return (
				<p>Waiting for customer to confirm the receipt</p>
			);
		case FINISHED:
			return (
				<p>This order is finished.</p>
			);
		case CANCELING:
			return (
				<p>Do you want to cancel this order?</p>
			);
		case CANCELED:
			return (
				<p>This order has been canceled.</p>
			);
		default:
			return (
				<p>Oops...</p>
			);
		}
	}

	render() {
		return (
			<Grid>
				{this.props.ready ? this.renderOrderList() : ""}
			</Grid>);
	}
}

ChefOrderList.propTypes = {
	recipes: PropTypes.object,
	orders: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker(() => {
	const orderHandler = Meteor.subscribe("chefAllOrders");
	const openOrders = Orders.find(
		{chef_id: Meteor.userId(), status: {$in: [NEW, ACCEPTED, READY, PICKED_UP]}},
		{sort: {status: 1, create_time: -1}}).fetch();
	const closedOrders = Orders.find(
		{chef_id: Meteor.userId(), status: {$in: [FINISHED, CANCELED, CANCELING]}},
		{sort: {create_time: -1}}).fetch();
	const orders = openOrders.concat(closedOrders);

	const recipeIdSet = new Set();
	for (let i = 0; i < orders.length; i++) {
		const recipes = orders[i].recipes;
		for (let j = 0; j < recipes.length; j++) {
			recipeIdSet.add(recipes[j].recipe_id);
		}
	}
	const recipeIds = Array.from(recipeIdSet);
	const recipeHandler = Meteor.subscribe("recipes", recipeIds);
	const recipeInfos = Recipes.find({_id: {$in: recipeIds}}).fetch();
	const recipeInfoObj = {};
	for (let i = 0; i < recipeInfos.length; i++) {
		const recipe = recipeInfos[i];
		recipeInfoObj[recipe._id] = recipe;
	}
	const ready = orderHandler.ready() && recipeHandler.ready();

	return {
		recipes: recipeInfoObj,
		orders: orders,
		ready: ready,
	};
})(ChefOrderList);