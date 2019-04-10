import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

import "../style/homepage.css";
import { Menu, Button } from "semantic-ui-react";

export default class NavigationBar extends Component {
	renderUserMode() {
		if (!Meteor.userId()) {
			return (
				<Menu.Menu position='right'>
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
				<Menu.Menu position='right'>
					<Menu.Item>
						<Button onClick={() => {Meteor.logout(() => {this.forceUpdate();});}}>Logout</Button>
					</Menu.Item>
					<Menu.Item>
						<Link to={"/mypage"}><Button color={"blue"}>My Page</Button></Link>
					</Menu.Item>
				</Menu.Menu>

			);
		}
	}

	render() {
		return (
			<Menu>
				<Menu.Item header>Neighborhood Chef</Menu.Item>
				<Menu.Item>
					<Link to={"/"}>Home</Link>
				</Menu.Item>
				{this.renderUserMode()}
			</Menu>
		);
	}
}