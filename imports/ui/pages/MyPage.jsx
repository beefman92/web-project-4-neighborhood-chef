import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Redirect } from "react-router-dom";
import { Segment, Icon, Button, Grid, Container, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import NavigationBar from "../components/NavigationBar";
import CustomerOrderBoard from "../components/CustomerOrderBoard";
import CustomerInfoBoard from "../components/CustomerInfoBoard";

const INFO = "INFO";
const ORDERS = "ORDERS";

export default class MyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChef: false,
			activeItem: INFO,
		};
	}

	renderChefInfoLink() {
		if (Meteor.user().profile.is_chef || this.state.isChef) {
			return (
				<Link to={"/chefinfo"}><Button color={"green"}>Add new recipe</Button></Link>
			);
		} else {
			return  (
				<Button color={"green"} onClick={() => {this.handleCreateNewChef();}}>
					I want to be a chef!
				</Button>
			);
		}
	}

	handleCreateNewChef() {
		Meteor.call("chefs.insertOrUpdate", (error) => {
			if (error === undefined || error === null) {
				this.setState({isChef: true});
			}
		});
	}

	handleChangeSubPage(data) {
		this.setState({
			activeItem: data.name
		});
	}

	render() {
		if (Meteor.user()) {
			return (
				<div>
					<NavigationBar/>
					<Container>
						<Grid>
							<Grid.Row divided>
								<Grid.Column width={"3"}>
									<img style={{width: "100px", borderRadius: "50%"}} src="/images/pacman.svg" alt="user's profile picture"/>
								</Grid.Column>
								<Grid.Column width={"13"}>
									<Segment.Group>
										<Segment>
											<h2>Personal Information</h2>
										</Segment>
										<Segment textAlign={"right"}>
											{this.renderChefInfoLink()}
										</Segment>
									</Segment.Group>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={3}>
									<Menu fluid vertical>
										<Menu.Item
											color={"orange"}
											name={INFO}
											active={this.state.activeItem === INFO}
											onClick={(e, data) => this.handleChangeSubPage(data)} />
										<Menu.Item
											color={"orange"}
											name={ORDERS}
											active={this.state.activeItem === ORDERS}
											onClick={(e, data) => this.handleChangeSubPage(data)} />
									</Menu>
								</Grid.Column>
								<Grid.Column width={13}>
									{this.state.activeItem === INFO ? <CustomerInfoBoard /> : <CustomerOrderBoard />}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
				</div>
			);
		} else {
			return (<Redirect to={"/login"}/>);
		}
	}
}