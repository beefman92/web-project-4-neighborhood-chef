import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Redirect } from "react-router-dom";
import { Segment, Icon } from "semantic-ui-react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavigationBar from "../components/NavigationBar";
import ShoppingCart from "../components/ShoppingCart";

export default class MyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChef: false,
		};
	}

	renderChefInfoLink() {
		if (Meteor.user().profile.is_chef || this.state.isChef) {
			return (
				<Row>
					<Col lg={"10"}></Col>
					<Col lg={"2"}><Link to={"/chefinfo"}><Button variant={"success"}>Add new recipe</Button></Link></Col>
				</Row>
			);
		} else {
			return  (
				<Row>
					<Col lg={"10"}></Col>
					<Col lg={"2"}>
						<Button variant={"success"} onClick={() => {this.handleCreateNewChef();}}>
							I want to be a chef!
						</Button>
					</Col>
				</Row>
			);
		}
	}

	handleCreateNewChef() {
		Meteor.call("chefs.insertOrUpdate", (error) => {
			if (error === undefined || error === null) {
				this.setState({isChef: true});
			}
		});
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
					{this.renderChefInfoLink()}
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