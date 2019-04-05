import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import {Redirect} from "react-router-dom";
import {withTracker} from "meteor/react-meteor-data";
import { Segment, Header, Icon, Image } from "semantic-ui-react";
import PropTypes from "prop-types";


class MyPage extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		// if (Meteor.user() === undefined || Meteor.user() === null) {
		//         return (
		//             <Redirect to = {"/"}/>
		//         );
		// }
		return (
			<div>
				<Header as='h2' icon textAlign='center'>
					<Icon name='users' circular />
					<Header.Content>Personal Information</Header.Content>
				</Header>
				{Meteor.user()? (
					<div>
						<Segment color='orange'>Username: {Meteor.user().username}</Segment>
						<Segment color='orange'>Address: {Meteor.user().profile.address}</Segment>
						<Segment color='orange'>Phone Number: {Meteor.user().profile.phone}</Segment>
						<Segment color='orange'>Gender: {Meteor.user().profile.gender}</Segment>
					</div>
				) :
					<div></div>}
			</div>
		);
	}
}

MyPage.propTypes = {
	personal_info: PropTypes.object,
};

// return will fill in the target
export default withTracker(() => {
	return {
		personal_info: Meteor.user()

	};
})(MyPage); // Target