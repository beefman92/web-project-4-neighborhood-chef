import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Image, Container, Button, Form, Grid, Header, Segment} from "semantic-ui-react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Recipes } from "../../api/recipes";
import { Row, Col, CardColumns, Card, Breadcrumb } from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";

import {Link} from "react-router-dom";
import {Chefs} from "../../api/chefs";

class ChefInfo extends Component {
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

	renderChefInfo() {
		if (this.props.ready === true) {
			return (
				<div>
					<Segment compact>
						<h2>Chef&#39;s Page: </h2>
						<Header as='h2'>
							<Image circular src="https://st2.depositphotos.com/4908849/9632/v/950/depositphotos_96323190-stock-illustration-italian-chef-vector.jpg" />{this.props.chefInfo.name}
						</Header>
						<Col lg={"9"}>
							<div>{this.props.chefInfo.description}</div>
							<div>{this.props.chefInfo.address}</div>
							<div>{this.props.chefInfo.phone}</div>
						</Col>
					</Segment>
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
							<img className={"recipe-list-image"} src={recipe.picture} alt={recipe.name} />
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


	render() {
		return (
			<div>
				<Container>
					<NavigationBar />
					{this.renderChefInfo()}
					{this.renderRecipes()}
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
									size = "big"
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
											size = "big"
										/>
										<label htmlFor="recipePicture">Picture</label>
										<Form.Input
											id={"recipePicture"}
											fluid
											iconPosition = "left"
											type = "url"
											name = "picture"
											placeholder = "Picture"
											size = "big"
										/>
										<label htmlFor="recipeContent">Content</label>
										<Form.Input
											id={"recipeContent"}
											fluid
											iconPosition = "left"
											type = "text"
											name = "content"
											placeholder = "Content"
											size = "big"
										/>
										<label htmlFor="recipePrice">Price</label>
										<Form.Input
											id={"recipePrice"}
											fluid
											iconPosition = "left"
											type = "number"
											name = "price"
											placeholder = "Price"
											size = "big"
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
				{/*{this.renderRecipes()}*/}

			</div>
		);
	}
}


ChefInfo.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			chefId: PropTypes.string.isRequired,
		}),
	}),
	chefInfo: PropTypes.object,
	history: PropTypes.object,
	recipes: PropTypes.array,
};

export default withTracker((props)=>{
	const userId = Meteor.userId();
	const handler = Meteor.subscribe("chefInfo", userId);
	const ready = handler.ready();

	Meteor.subscribe("chefRecipes", userId);
	return {
		chefInfo: Chefs.findOne({_id: userId}),
		recipes: Recipes.find({chef_id: userId}).fetch(),
		ready: ready,
	}

})(ChefInfo);


