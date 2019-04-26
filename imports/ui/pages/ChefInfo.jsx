import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Container, Button, Form, Grid, Header, Segment, Menu} from "semantic-ui-react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { CardColumns, Card } from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";
import ChefOrderBoard from "../components/ChefOrderBoard";
import { Chefs } from "../../api/chefs";
import { Recipes } from "../../api/recipes";
import ChefInfoBoard from "../components/ChefInfoBoard";
import Footer from "../components/Footer";

const INFO = "INFO";
const RECIPES = "RECIPES";
const ORDERS = "ORDERS";

class ChefInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: INFO,
		};
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

	handleRecipeInfo(id, index) {
		let name = this.state.recipe[index].name;
		let picture = this.state.recipe[index].picture;
		let content = this.state.recipe[index].content;
		let price = Number(this.state.recipe[index].price);
		Meteor.call("recipes.updateRecipes", id, name, content, picture, price, (error) => {
			if (error !== undefined && error !== null) {
				alert(error);
			}
		});
	}

	handleRecipeOnChange(e, index) {
		const newRecipe = [];
		for (let i = 0; i < this.state.recipe.length; i++) {
			const temp = Object.assign({}, this.state.recipe[i]);
			newRecipe.push(temp);
		}
		const item = newRecipe[index];
		item[e.target.name] = e.target.value;
		this.setState({
			recipe: newRecipe
		});
	}

	renderRecipes() {
		const recipes = this.state.recipe.map((recipe, index) => {
			return (
				<Segment key={recipe._id}>
					<Card key={recipe._id}>
						<Card.Header>
							<Card.Title>
								Recipe Name: {this.props.recipes[index].name}
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<img className={"recipe-list-image"} src={this.props.recipes[index].picture} />
							<br/>
							Price: {this.props.recipes[index].price}
							<br/>
							Content: {this.props.recipes[index].content}
							<Button onClick={() => this.handleRecipeInfo(recipe._id, index)} color={"green"} floated="right">Edit</Button>
						</Card.Body>

						<Card.Footer className="text-muted">
							{"0 customers have ordered"}
						</Card.Footer>
					</Card>
					<div>
						<Form
							size = "big"
							onValidate
						>
							<Segment stacked>
								<label htmlFor="name">Recipe Name</label>
								<Form.Input
									id ={"name"}
									fluid
									iconPosition = "left"
									type = "text"
									name = "name"
									placeholder = "recipe name"
									size = "big"
									value={recipe.name}
									onChange={(e) => this.handleRecipeOnChange(e, index)}
								/>
								<label htmlFor="price">Recipe Price</label>
								<Form.Input
									id={"price"}
									fluid
									iconPosition = "left"
									type = "number"
									name = "price"
									placeholder = "recipe price"
									size = "big"
									value={recipe.price}
									onChange={(e) => this.handleRecipeOnChange(e, index)}
								/>
								<label htmlFor="content">Recipe Content</label>
								<Form.Input
									id={"content"}
									fluid
									iconPosition = "left"
									type = "text"
									name = "content"
									placeholder = "recipe content"
									size = "big"
									value={recipe.content}
									onChange={(e) => this.handleRecipeOnChange(e, index)}
								/>
							</Segment>
						</Form>
					</div>
				</Segment>
			);
		});
		return (
			<div>
				<h2>Recipes List: </h2>
				<CardColumns>
					{recipes}
				</CardColumns>
				<Grid
					textAlign = "center"
					style = {{ height: "70vh"}}
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
			</div>
		);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({
			chefInfo: nextProps.chefInfo,
			recipe: nextProps.recipes
		});
	}

	renderSubPage() {
		switch (this.state.activeItem) {
		case INFO:
			return (<ChefInfoBoard />);
		case RECIPES:
			return this.renderRecipes();
		case ORDERS:
			return (<ChefOrderBoard />);
		}
	}

	handleChangeSubPage(data) {
		this.setState({
			activeItem: data.name
		});
	}

	render() {
		if (!this.props.ready) {
			return (
				<p>Loading...</p>
			);
		}
		let pictureUrl = "";
		if (!this.props.chefInfo.picture) {
			pictureUrl = "https://st2.depositphotos.com/4908849/9632/v/950/depositphotos_96323190-stock-illustration-italian-chef-vector.jpg";
		} else {
			pictureUrl = this.props.chefInfo.picture;
		}
		return (
			<div>
				<NavigationBar />
				<Container>
					<Grid>
						<Grid.Row divided>
							<Grid.Column className={"chef-icon-wrapper"} width={"2"}>
								<img
									className={"chef-icon"}
									src={pictureUrl}
									alt="chef's profile picture"/>
							</Grid.Column>
							<Grid.Column width={"14"}>
								<Segment>
									<h2>Chef Information</h2>
								</Segment>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={"2"}>
								<Menu fluid vertical pointing>
									<Menu.Item
										color={"orange"}
										name={INFO}
										active={this.state.activeItem === INFO}
										onClick={(e, data) => this.handleChangeSubPage(data)} />
									<Menu.Item
										color={"orange"}
										name={RECIPES}
										active={this.state.activeItem === RECIPES}
										onClick={(e, data) => this.handleChangeSubPage(data)} />
									<Menu.Item
										color={"orange"}
										name={ORDERS}
										active={this.state.activeItem === ORDERS}
										onClick={(e, data) => this.handleChangeSubPage(data)} />
								</Menu>
							</Grid.Column>
							<Grid.Column width={14}>
								{this.renderSubPage()}
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
				<Footer/>
			</div>
		);
	}
}


ChefInfo.propTypes = {
	chefInfo: PropTypes.object,
	history: PropTypes.object,
	recipes: PropTypes.array,
	ready: PropTypes.bool,
};

export default withTracker(()=>{
	const userId = Meteor.userId();
	const chefInfoHandler = Meteor.subscribe("chefInfo", userId);
	const chefRecipesHandler = Meteor.subscribe("chefRecipes", userId);
	const ready = chefInfoHandler.ready() && chefRecipesHandler.ready();
	return {
		chefInfo: Chefs.findOne({_id: userId}),
		recipes: Recipes.find({chef_id: userId}).fetch(),
		ready: ready,
	};

})(ChefInfo);


