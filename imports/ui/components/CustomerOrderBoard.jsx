import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Orders } from "../../api/orders";
import { Recipes } from "../../api/recipes";
import { Grid, Card, Segment, Button, Icon} from "semantic-ui-react";
import { ACCEPTED, CANCELING, CANCELED, FINISHED, NEW, PICKED_UP, READY, HAS_COMMENT, NO_COMMENT } from "../../api/constants";
import "../style/my-page.css";
import {Chefs} from "../../api/chefs";
import CommentModal from "../components/CommentModal";

class CustomerOrderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openComments: Array(this.props.orders.length).fill(false),
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			openComments: Array(nextProps.orders.length).fill(false),
		});
	}

	renderOrderList() {
		if (this.props.orders.length === 0) {
			return (
				<Grid.Row>
					<Grid.Column width={"16"}>
						<Segment style={{fontSize: "20px"}} textAlign={"center"}>
							It seems like your order history is empty. <Link to={"/"}>Go to get your first order!</Link>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			);
		}
		return (
			this.props.orders.map((value, index) => {
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
												{this.renderOperationButton(value, index)}
											</Grid.Column>
										</Grid.Row>
										{this.renderCommentForm(value, index)}
									</Grid>
								</Card.Content>
								<Card.Content>
									<b>Pick up address: </b>{this.props.chefAddressMap.get(value.chef_id)}
								</Card.Content>
							</Card>
						</Grid.Column>
					</Grid.Row>
				);
			})
		);
	}

	handleModalClose(index) {
		const open = this.state.openComments.slice();
		open[index] = false;
		this.setState({
			openComments: open,
		});
	}

	renderCommentForm(order, index) {
		if (order.comment_status === NO_COMMENT) {
			return (
				<CommentModal
					order={order}
					recipes={this.props.recipes}
					open={this.state.openComments[index]}
					onClose={() => this.handleModalClose(index)}
				/>
			);
		} else {
			return "";
		}
	}

	computeSumPrice(recipesInOrders) {
		let sum = 0;
		recipesInOrders.forEach(value => {
			sum += value.price;
		});
		return sum;
	}

	handleDeleteOrder(id) {
		Meteor.call("orders.customerDeleteOrder", id);
	}

	handleCancelOrder(id) {
		Meteor.call("orders.customerCancel", id);
	}

	handlePickup(id) {
		Meteor.call("orders.customerPickedUpFood", id);
	}

	handleConfirmation(id) {
		Meteor.call("orders.customerConfirm", id);
	}

	openCommentForm(index) {
		const newArray = this.state.openComments.slice();
		newArray[index] = true;
		this.setState({
			openComments: newArray,
		});
	}

	renderOperationButton(order, index) {
		switch(order.status) {
		case NEW:
			return (
				<Button onClick={() => this.handleCancelOrder(order._id)} negative>Cancel</Button>
			);
		case ACCEPTED:
			return (
				<Button onClick={() => this.handleCancelOrder(order._id)} negative>Cancel</Button>
			);
		case READY:
			return (
				<div>
					<Button onClick={() => this.handlePickup(order._id)} positive>Pick</Button>
					<Button onClick={() => this.handleCancelOrder(order._id)} negative>Cancel</Button>
				</div>
			);
		case PICKED_UP:
			return (
				<div>
					<Button onClick={() => this.handleConfirmation(order._id)} positive>Confirm</Button>
					<Button onClick={() => this.handleCancelOrder(order._id)} negative>Cancel</Button>
				</div>
			);
		case FINISHED:
			if (order.comment_status === HAS_COMMENT) {
				return "Thanks for your comments. ";
			} else if (order.comment_status === NO_COMMENT) {
				return (
					<Button onClick={() => this.openCommentForm(index)} positive>Comment</Button>
				);
			} else {
				return "";
			}
		case CANCELING:
			return (
				<Button disabled={true} negative>Canceling</Button>
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
				<p>Waiting for the chef to accept this order...</p>
			);
		case ACCEPTED:
			return (
				<p>Waiting for meal ready...</p>
			);
		case READY:
			return (
				<p>Meal is ready.</p>
			);
		case PICKED_UP:
			return (
				<p>Please finish this order after confirming the meal.</p>
			);
		case FINISHED:
			return (
				<p>This order is finished.</p>
			);
		case CANCELING:
			return (
				<p>Waiting for chef to approve this cancellation.</p>
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

	render() {
		if (!this.props.ready) {
			return ("");
		} else {
			return (
				<Grid>
					{this.renderOrderList()}
				</Grid>
			);
		}
	}
}

CustomerOrderBoard.propTypes = {
	recipes: PropTypes.object,
	chefAddressMap: PropTypes.object,
	orders: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker(() => {
	const orderHandler = Meteor.subscribe("customerAllOrders");
	const orders = Orders.find({customer_id: Meteor.userId()}, {sort: {create_time: -1}}).fetch();
	const recipeIdSet = new Set();
	const chefIdSet = new Set();
	for (let i = 0; i < orders.length; i++) {
		const recipes = orders[i].recipes;
		for (let j = 0; j < recipes.length; j++) {
			recipeIdSet.add(recipes[j].recipe_id);
		}
		chefIdSet.add(orders[i].chef_id);
	}
	const chefIds = Array.from(chefIdSet);
	const recipeIds = Array.from(recipeIdSet);
	const recipeHandler = Meteor.subscribe("recipes", recipeIds);
	const recipeInfos = Recipes.find({_id: {$in: recipeIds}}).fetch();
	const recipeInfoObj = {};
	for (let i = 0; i < recipeInfos.length; i++) {
		const recipe = recipeInfos[i];
		recipeInfoObj[recipe._id] = recipe;
	}


	const chefInfoHandler = Meteor.subscribe("chefInfos", chefIds);
	const temp = Chefs.find({_id: {$in: chefIds}}).fetch();
	const chefAddressMap = new Map();
	for (let i = 0; i < temp.length; i++) {
		chefAddressMap.set(temp[i]._id, temp[i].address);
	}

	const ready = orderHandler.ready() && recipeHandler.ready() && chefInfoHandler.ready();
	return {
		recipes: recipeInfoObj,
		chefAddressMap: chefAddressMap,
		orders: orders,
		ready: ready,
	};
})(CustomerOrderBoard);