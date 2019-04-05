import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Redirect } from "react-router-dom";
import { Segment, Icon } from "semantic-ui-react";
import { Row, Col } from "react-bootstrap";

import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";

export default class MyPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (Meteor.user()) {
			return (
				<div>
					<NavigationBar/>
					<ShoppingCart/>
					<Row>
						<Col className={"text-center"} lg={"12"}>
							<Icon name="users" circular />
							<div>
								<h2>Personal Information</h2>
							</div>
						</Col>
					</Row>
					<div>
						<Segment color='orange'>Username: {Meteor.user().username}</Segment>
						<Segment color='orange'>Address: {Meteor.user().profile.address}</Segment>
						<Segment color='orange'>Phone Number: {Meteor.user().profile.phone}</Segment>
						<Segment color='orange'>Gender: {Meteor.user().profile.gender}</Segment>
					</div>
				</div>
			);
		} else {
			return (<Redirect to={"/login"}/>);
		}

	}
}

// MyPage.propTypes = {
// 	personal_info: PropTypes.object,
// };
//
// // return will fill in the target
// export default withTracker(() => {
// 	return {
// 		personal_info: Meteor.user()
//
// 	};
// })(MyPage); // Target