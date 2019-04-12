import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Orders } from "../../api/orders";
import { Recipes } from "../../api/recipes";
import { Grid, Card, Segment, Button, Icon, Form, Radio, TextArea } from "semantic-ui-react";
import { ACCEPTED, CANCELING, CANCELED, FINISHED, NEW, PICKED_UP, READY } from "../../api/order-status";
import "../style/my-page.css";

class CustomerOrderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openComments: Array(this.props.orders.length).fill(false),
			rating: Array(this.props.orders.length).fill("5"),
			comments: Array(this.props.orders.length).fill(""),
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			openComments: Array(nextProps.orders.length).fill(false),
			rating: Array(this.props.orders.length).fill("5"),
			comments: Array(this.props.orders.length).fill(""),
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
										{this.renderCommentForm(index)}
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

	handleChangeRating(index, data) {
		const newArray = this.state.rating.slice();
		newArray[index] = data.value;
		this.setState({
			rating: newArray,
		});
	}

	handleChangeComments(index, event) {
		const newArray = this.state.comments.slice();
		newArray[index] = event.target.value;
		this.setState({
			comments: newArray,
		});
	}

	handleSubmit(index, e) {
		e.preventDefault();
		const rating = Number(this.state.rating[index]);
		const comment = this.state.comments[index];
		const order = this.props.orders[index];
		const orderId = order._id;
		const recipeIds = [];
		for (let i = 0; i < order.recipes.length; i++) {
			recipeIds.push(order.recipes[i].recipe_id);
		}
		Meteor.call("recipeComments.comment", orderId, recipeIds, rating, comment, (error) => {
			if (error === undefined || error === null) {
				const newRating = this.state.rating.slice();
				newRating[index] = "5";
				const newComments = this.state.comments.slice();
				newComments[index] = "";
				const newOpen = this.state.openComments.slice();
				newOpen[index] = false;
				this.setState({
					openComments: newOpen,
					rating: newRating,
					comments: newComments,
				});
			}
		});
	}

	renderCommentForm(index) {
		if (this.state.openComments[index]) {
			return (
				<Grid.Row>
					<Form onSubmit = {(e) => this.handleSubmit(index, e)}>
						<Form.Group inline>
							<label>Rating</label>
							<Form.Field
								control={Radio}
								label="1"
								value="1"
								checked={this.state.rating[index] === "1"}
								onChange={(e, data) => this.handleChangeRating(index, data, e)}
							/>
							<Form.Field
								control={Radio}
								label="2"
								value="2"
								checked={this.state.rating[index] === "2"}
								onChange={(e, data) => this.handleChangeRating(index, data, e)}
							/>
							<Form.Field
								control={Radio}
								label="3"
								value="3"
								checked={this.state.rating[index] === "3"}
								onChange={(e, data) => this.handleChangeRating(index, data, e)}
							/>
							<Form.Field
								control={Radio}
								label="4"
								value="4"
								checked={this.state.rating[index] === "4"}
								onChange={(e, data) => this.handleChangeRating(index, data, e)}
							/>
							<Form.Field
								control={Radio}
								label="5"
								value="5"
								checked={this.state.rating[index] === "5"}
								onChange={(e, data) => this.handleChangeRating(index, data, e)}
							/>
						</Form.Group>
						<Form.Field
							control={TextArea}
							name="comments"
							label="comments"
							value={this.state.comments[index]}
							placeholder='Tell us more about you...'
							onChange={(e) => this.handleChangeComments(index, e)}/>
						<Button positive>Submit</Button>
					</Form>
				</Grid.Row>
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
			return (
				<Button onClick={() => this.openCommentForm(index)} positive>Comment</Button>
			);
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
	orders: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker(() => {
	const orderHandler = Meteor.subscribe("customerAllOrders");
	const orders = Orders.find({customer_id: Meteor.userId()}, {sort: {create_time: -1}}).fetch();
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
})(CustomerOrderBoard);