import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

import "../style/homepage.css";
import { Menu, Button, Container } from "semantic-ui-react";

export default class NavigationBar extends Component {
	renderUserMode() {
		if (!Meteor.user()) {
			return (
				<Menu.Menu position="right">
					<Menu.Item>
						<Link to={"/signup"}><Button color={"blue"}>Sign Up</Button></Link>
					</Menu.Item>
					<Menu.Item>
						<Link to={"/login"}><Button  color={"blue"}>Login</Button></Link>
					</Menu.Item>
				</Menu.Menu>
			);
		} else {
			return (
				<Menu.Menu position="right">
					<Menu.Item>
						<Button onClick={() => {Meteor.logout(() => {this.forceUpdate();});}}>Logout</Button>
					</Menu.Item>
					<Menu.Item>
						<Link to={"/mypage"}><Button color={"blue"}>User Page</Button></Link>
					</Menu.Item>
					{Meteor.user().profile.is_chef ?
						<Menu.Item>
							<Link to={"/chefinfo"}><Button color={"blue"}>Chef Page</Button></Link>
						</Menu.Item>
						: ""}
				</Menu.Menu>
			);
		}
	}

	render() {
		return (
			<Menu style={{marginBottom: "4em"}} inverted color={"orange"}>
				<Container>
					<Menu.Item header>Neighborhood Chef</Menu.Item>
					<Menu.Item>
						<Link to={"/"}>Home</Link>
					</Menu.Item>
					{this.renderUserMode()}
				</Container>
			</Menu>
		);
	}
}