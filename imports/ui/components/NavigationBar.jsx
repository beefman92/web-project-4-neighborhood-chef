import React, { Component } from "react";
import { Navbar, Nav, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

import "../style/homepage.css";

export default class NavigationBar extends Component {
	renderUserMode() {
		if (!Meteor.userId()) {
			return (
				<div>
					<Link to={"/signup"}><Button className={"mx-1"} variant="outline-primary">Sign Up</Button></Link>
					<Link to={"/login"}><Button className={"mx-1"} variant="outline-primary">Login</Button></Link>
				</div>
			);
		} else {
			return (
				<div>
					<Button className={"mx-1"} variant="outline-black" onClick={() => {Meteor.logout(() => {this.forceUpdate();});}}>Logout</Button>
					<Link to={"/mypage"}><Button className={"mx-1"} variant="outline-primary">My Page</Button></Link>
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				<Navbar bg="light">
					<Navbar.Brand href="/">Neighborhood Chef</Navbar.Brand>
					<Nav className="mr-auto">
						<Link className={"nav-link"} to={"/"}>Home</Link>
					</Nav>
					{this.renderUserMode()}
				</Navbar>
				<Row className={"my-3"}>
					<Col className={"text-center"} lg={"12"}>
						<h1>Welcome to Neighborhood Chef!</h1>
					</Col>
				</Row>
			</div>
		);
	}
}