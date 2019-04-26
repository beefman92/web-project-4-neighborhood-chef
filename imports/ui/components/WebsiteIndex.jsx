import React, { Component } from "react";
import { Breadcrumb, Grid } from "semantic-ui-react";
import PropTypes from "prop-types";

export default class WebsiteIndex extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid.Row>
				<Grid.Column width={"16"}>
					<Breadcrumb sections={this.props.sections} />
				</Grid.Column>
			</Grid.Row>
		);
	}
}

WebsiteIndex.propTypes = {
	sections: PropTypes.array.isRequired,
};