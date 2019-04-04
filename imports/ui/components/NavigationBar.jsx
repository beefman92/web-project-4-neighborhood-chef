import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../style/homepage.css";

export default class NavigationBar extends Component {
	render() {
		return (
			<Navbar bg="primary" variant="dark">
				<Navbar.Brand href="/">Neighborhood Chef</Navbar.Brand>
				<Nav className="mr-auto">
					<Link className={"nav-link"} to={"/"}>Home</Link>
				</Nav>
			</Navbar>
		);
	}
}