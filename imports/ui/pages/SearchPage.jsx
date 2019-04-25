import React, { Component } from "react";

import SearchBoard from "../components/SearchBoard";
import NavigationBar from "../components/NavigationBar";

export default class SearchPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div>
				<NavigationBar />
				<SearchBoard />
			</div>
		);
	}
}