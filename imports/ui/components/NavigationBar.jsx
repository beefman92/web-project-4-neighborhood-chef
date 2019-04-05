import React, { Component } from "react";
import { Navbar, Nav, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../style/homepage.css";

export default class NavigationBar extends Component {
	render() {
		return (
			<div>
				<Navbar bg="primary" variant="dark">
					<Navbar.Brand href="/">Neighborhood Chef</Navbar.Brand>
					<Nav className="mr-auto">
						<Link className={"nav-link"} to={"/"}>Home</Link>
					</Nav>
				</Navbar>
				<Row>
					<Col className={"text-center"} lg={"12"}>
						<h1>Welcome to Neighborhood Chef!</h1>
					</Col>
				</Row>
			</div>
		);
	}
}