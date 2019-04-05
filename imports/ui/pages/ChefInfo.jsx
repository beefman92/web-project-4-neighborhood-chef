import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Container, Button, Form, Grid, Header, Segment} from "semantic-ui-react";
import PropTypes from "prop-types";

import NavigationBar from "../components/NavigationBar";

export default class ChefInfo extends Component {
	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		let name = e.target.name.value.trim();
		let picture = e.target.picture.value.trim();
		let content = e.target.content.value.trim();
		let price = Number(e.target.price.value);

		Meteor.call("recipes.insert", name, content, picture, price, (error) => {
			if (error !== undefined && error !== null) {
				alert(error);
			} else {
				this.props.history.push("/mypage");
			}
		});
	}

	render() {
		return (
			<div>
				<Container>
					<NavigationBar />
					<Grid
						textAlign = "center"
						style = {{ height: "95vh"}}
						divided = "vertically"
						verticalAlign = "middle"
						id = "grid"
					>
						<Grid.Row columns = {2}>
							<Grid.Column>
								<Header as = "h2" textAlign = "center" id = "signupHeader">
									Add Recipe
								</Header>

								<Form
									size = "huge"
									onSubmit = {this.onSubmit.bind(this)}
									onValidate
								>
									<Segment stacked>
										<label htmlFor="recipeName">Recipe Name</label>
										<Form.Input
											id={"recipeName"}
											fluid
											iconPosition = "left"
											type = "text"
											name = "name"
											placeholder = "Name"
											size = "huge"
										/>
										<label htmlFor="recipePicture">Picture</label>
										<Form.Input
											id={"recipePicture"}
											fluid
											iconPosition = "left"
											type = "url"
											name = "picture"
											placeholder = "Picture"
											size = "huge"
										/>
										<label htmlFor="recipeContent">Content</label>
										<Form.Input
											id={"recipeContent"}
											fluid
											iconPosition = "left"
											type = "text"
											name = "content"
											placeholder = "Content"
											size = "huge"
										/>
										<label htmlFor="recipePrice">Price</label>
										<Form.Input
											id={"recipePrice"}
											fluid
											iconPosition = "left"
											type = "number"
											name = "price"
											placeholder = "Price"
											size = "huge"
										/>
										<Button fluid size = "huge" id = "accountButton">
											Upload Recipe
										</Button>
									</Segment>
								</Form>

							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
}


ChefInfo.propTypes = {
	history: PropTypes.object,
};