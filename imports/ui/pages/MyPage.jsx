import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Redirect } from "react-router-dom";
import { Segment, Icon, Button, Grid, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

import NavigationBar from "../components/NavigationBar";
import CustomerOrderList from "../components/CustomerOrderList";

export default class MyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChef: false,
		};
	}

	renderChefInfoLink() {
		if (Meteor.user().profile.is_chef || this.state.isChef) {
			return (
				<Grid.Row>
					<Grid.Column width={"13"}></Grid.Column>
					<Grid.Column width={"3"}><Link to={"/chefinfo"}><Button color={"green"}>Add new recipe</Button></Link></Grid.Column>
				</Grid.Row>
			);
		} else {
			return  (
				<Grid.Row>
					<Grid.Column width={"13"}></Grid.Column>
					<Grid.Column width={"3"}>
						<Button color={"green"} onClick={() => {this.handleCreateNewChef();}}>
							I want to be a chef!
						</Button>
					</Grid.Column>
				</Grid.Row>
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

	renderPersonalInfo() {
		return (
			<Grid.Row>
				<Grid.Column width={"16"}>
					<Segment color={"orange"}>
						Username: {Meteor.user().username}
					</Segment>
				</Grid.Column>
				<Grid.Column width={"16"}>
					<Segment color={"orange"}>
						Address: {Meteor.user().profile.address}
					</Segment>
				</Grid.Column>
				<Grid.Column width={"16"}>
					<Segment color={"orange"}>
						Phone Number: {Meteor.user().profile.phone}
					</Segment>
				</Grid.Column>
				<Grid.Column width={"16"}>
					<Segment color={"orange"}>
					Gender: {Meteor.user().profile.gender}
					</Segment>
				</Grid.Column>
			</Grid.Row>
		);
	}

	render() {
		if (Meteor.user()) {
			return (
				<div>
					<NavigationBar/>
					<Container>
						<Grid>
							<Grid.Row>
								<Grid.Column className={"text-center"} width={"16"}>
									<Icon name="users" circular />
									<div>
										<h2>Personal Information</h2>
									</div>
								</Grid.Column>
							</Grid.Row>
							{this.renderChefInfoLink()}
							{this.renderPersonalInfo()}
							<CustomerOrderList />
						</Grid>
					</Container>
				</div>
			);
		} else {
			return (<Redirect to={"/login"}/>);
		}
	}
}