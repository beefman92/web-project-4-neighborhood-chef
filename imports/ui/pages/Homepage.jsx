import React, { Component } from "react";

import SearchBoard from "../components/SearchBoard";
import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";

export default class Homepage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<NavigationBar />
				<ShoppingCart />
				<SearchBoard />
			</div>
		);
	}
}