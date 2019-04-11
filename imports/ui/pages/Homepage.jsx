import React, { Component } from "react";

import SearchBoard from "../components/SearchBoard";
import NavigationBar from "../components/NavigationBar";

export default class Homepage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<NavigationBar />
				<SearchBoard />
			</div>
		);
	}
}