import React, { Component } from "react";
import {Button, Modal, Radio, TextArea, Form, Grid} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import PropTypes from "prop-types";

import "../style/my-page.css";

export default class CommentModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			receiptPage: false,
			recipeComments: Array(this.props.order.recipes.length).fill(""),
			recipeRating: Array(this.props.order.recipes.length).fill("5"),
			chefComment: "",
			chefRating: "5",
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		const recipeComments = this.props.order.recipes.map((value, index) => {
			return {
				orderId: this.props.order._id,
				recipeId: value.recipe_id,
				rating: Number(this.state.recipeRating[index]),
				comment: this.state.recipeComments[index],
			};
		});
		const chefComment = {
			orderId: this.props.order._id,
			rating: Number(this.state.chefRating),
			comment: this.state.chefComment,
		};
		Meteor.call("comments.leaveComments", recipeComments, chefComment, (error) => {
			if (error === undefined || error === null) {
				this.setState({
					receiptPage: true,
					recipeComments: Array(this.props.order.recipes.length).fill(""),
					recipeRating: Array(this.props.order.recipes.length).fill(""),
					chefComment: "",
					chefRating: "",
				});
			}
		});
	}

	handleClose() {
		this.props.onClose();
	}

	renderReceipt() {
		return (
			<Modal open={this.props.open} onClose={() => this.handleClose()}>
				<Modal.Content>
					<Modal.Description>
						We have received your comments. Thanks for your patience.
					</Modal.Description>
				</Modal.Content>
			</Modal>
		);
	}

	renderCommentForm() {
		return (
			<Modal open={this.props.open} onClose={() => this.handleClose()}>
				<Modal.Header>How do you evaluate this meal?</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Grid divided>
							<Grid.Row>
								<Grid.Column className={"subheader"} width={"16"}>
									Evaluate recipes
								</Grid.Column>
							</Grid.Row>
							{this.renderRecipeCommentForm()}
							<Grid.Row>
								<Grid.Column className={"subheader"} width={"16"}>
									Evaluate chef
								</Grid.Column>
							</Grid.Row>
							{this.renderChefCommentForm()}
						</Grid>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		);
	}

	render() {
		if (this.state.receiptPage) {
			return this.renderReceipt();
		} else {
			return this.renderCommentForm();
		}
	}

	handleChangeRecipeRating(index, data) {
		const newArray = this.state.recipeRating.slice();
		newArray[index] = data.value;
		this.setState({
			recipeRating: newArray,
		});
	}

	handleChangeRecipeComments(index, event) {
		const newArray = this.state.recipeComments.slice();
		newArray[index] = event.target.value;
		this.setState({
			recipeComments: newArray,
		});
	}

	renderRecipeCommentForm() {
		return this.props.order.recipes.map((value, index) => {
			return (
				<Grid.Row key={value.recipe_id}>
					<Grid.Column width={"4"}>
						<div className={"comment-recipe-name"}>
							{this.props.recipes[value.recipe_id].name}
						</div>
						<div>
							<img
								className={"comment-image"}
								src={this.props.recipes[value.recipe_id].picture}
								alt={"picture of " + this.props.recipes[value.recipe_id].name}/>
						</div>
					</Grid.Column>
					<Grid.Column width={"12"}>
						<Form>
							<Form.Group inline>
								<label>Rating for recipe</label>
								<Form.Field
									control={Radio}
									label="1"
									value="1"
									checked={this.state.recipeRating[index] === "1"}
									onChange={(e, data) => this.handleChangeRecipeRating(index, data)}
								/>
								<Form.Field
									control={Radio}
									label="2"
									value="2"
									checked={this.state.recipeRating[index] === "2"}
									onChange={(e, data) => this.handleChangeRecipeRating(index, data)}
								/>
								<Form.Field
									control={Radio}
									label="3"
									value="3"
									checked={this.state.recipeRating[index] === "3"}
									onChange={(e, data) => this.handleChangeRecipeRating(index, data)}
								/>
								<Form.Field
									control={Radio}
									label="4"
									value="4"
									checked={this.state.recipeRating[index] === "4"}
									onChange={(e, data) => this.handleChangeRecipeRating(index, data)}
								/>
								<Form.Field
									control={Radio}
									label="5"
									value="5"
									checked={this.state.recipeRating[index] === "5"}
									onChange={(e, data) => this.handleChangeRecipeRating(index, data)}
								/>
							</Form.Group>
							<Form.Field
								control={TextArea}
								name="comments"
								label="Comment for recipe"
								value={this.state.recipeComments[index]}
								placeholder='Tell us more about you...'
								onChange={(e) => this.handleChangeRecipeComments(index, e)}/>
						</Form>
					</Grid.Column>
				</Grid.Row>
			);
		});
	}

	handleChefRating(data) {
		this.setState({
			chefRating: data.value,
		});
	}

	handleChefComment(event) {
		this.setState({
			chefComment: event.target.value,
		});
	}

	renderChefCommentForm() {
		return (
			<Grid.Row>
				<Grid.Column>
					<Form onSubmit={(e) => this.handleSubmit(e)}>
						<Form.Group inline>
							<label>Rating for chef</label>
							<Form.Field
								control={Radio}
								label="1"
								value="1"
								checked={this.state.chefRating === "1"}
								onChange={(e, data) => this.handleChefRating(data)}
							/>
							<Form.Field
								control={Radio}
								label="2"
								value="2"
								checked={this.state.chefRating === "2"}
								onChange={(e, data) => this.handleChefRating(data)}
							/>
							<Form.Field
								control={Radio}
								label="3"
								value="3"
								checked={this.state.chefRating === "3"}
								onChange={(e, data) => this.handleChefRating(data)}
							/>
							<Form.Field
								control={Radio}
								label="4"
								value="4"
								checked={this.state.chefRating === "4"}
								onChange={(e, data) => this.handleChefRating(data)}
							/>
							<Form.Field
								control={Radio}
								label="5"
								value="5"
								checked={this.state.chefRating === "5"}
								onChange={(e, data) => this.handleChefRating(data)}
							/>
						</Form.Group>
						<Form.Field
							control={TextArea}
							name="chefComment"
							label="Comment for chef"
							value={this.state.chefComment}
							placeholder='Tell us more about you...'
							onChange={(e) => this.handleChefComment(e)}/>
						<Button positive>Submit</Button>
					</Form>
				</Grid.Column>
			</Grid.Row>
		);
	}
}

CommentModal.propTypes = {
	order: PropTypes.object.isRequired,
	recipes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};