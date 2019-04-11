import React, { Component } from "react";
import {Grid, Segment, Button, Form, Message } from "semantic-ui-react";
import {Meteor} from "meteor/meteor";

const READ_ONLY = 0;
const EDITABLE = 1;

export default class CustomerInfoBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: READ_ONLY,
			info: {},
			error: false,
		};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleModifyForm = this.handleModifyForm.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleSave() {
		const newProfile = {
			address: this.state.info.address,
			phone: this.state.info.phone,
			gender: this.state.info.gender
		};
		Meteor.call("users.updateProfile", this.state.info.username, newProfile, (error) => {
			if (error === undefined || error === null) {
				this.setState({
					mode: READ_ONLY,
					info: {},
				});
			} else {
				this.setState({
					error: true,
				});
			}
		});
	}

	handleCancel() {
		this.setState({
			mode: READ_ONLY,
			info: {
				username: Meteor.user().username,
				address: Meteor.user().profile.address,
				phone: Meteor.user().profile.phone,
				gender: Meteor.user().profile.gender,
			}
		});
	}

	renderReadOnlyPersonalInfo() {
		return (
			<Segment.Group>
				<Segment color={"orange"}>
					Username: {Meteor.user().username}
				</Segment>
				<Segment color={"orange"}>
					Address: {Meteor.user().profile.address}
				</Segment>
				<Segment color={"orange"}>
					Phone Number: {Meteor.user().profile.phone}
				</Segment>
				<Segment color={"orange"}>
					Gender: {Meteor.user().profile.gender}
				</Segment>
			</Segment.Group>
		);
	}

	handleEdit() {
		this.setState({
			mode: EDITABLE,
			info: {
				username: Meteor.user().username,
				address: Meteor.user().profile.address,
				phone: Meteor.user().profile.phone,
				gender: Meteor.user().profile.gender,
			}
		});
	}

	handleModifyForm(event) {
		const name = event.target.name;
		const value = event.target.value;
		const newInfo = Object.assign({}, this.state.info);
		newInfo[name] = value;
		this.setState({
			info: newInfo,
		});
	}

	renderEditablePersonalInfo() {
		return (
			<Form id={"updatePersonalInfoForm"} error={this.state.error}>
				<Segment.Group>
					<Segment>
						<Form.Input
							label={"Username"}
							name="username"
							value={this.state.info.username}
							placeholder="username"
							onChange={this.handleModifyForm}/>
					</Segment>
					<Segment>
						<Form.Input
							label={"Address"}
							name="address"
							value={this.state.info.address}
							placeholder="address"
							onChange={this.handleModifyForm}/>
					</Segment>
					<Segment>
						<Form.Input
							label={"phone"}
							name="phone"
							value={this.state.info.phone}
							placeholder="XXX-XXX-XXXX"
							onChange={this.handleModifyForm}/>
					</Segment>
					<Segment>
						<Form.Input
							label={"gender"}
							name="gender"
							value={this.state.info.gender}
							placeholder="gender"
							onChange={this.handleModifyForm}/>
					</Segment>
				</Segment.Group>
				<Message
					id={"formAlertInfo"}
					error
					header="Updating personal information failed"
					content="Oops. Some errors occur. Please try again later. "
				/>
			</Form>
		);
	}

	render() {
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column width={"16"}>
						{this.state.mode === READ_ONLY ? this.renderReadOnlyPersonalInfo() : this.renderEditablePersonalInfo()}
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column width={"12"}>
					</Grid.Column>
					<Grid.Column width={"4"}>
						{this.state.mode === READ_ONLY ?
							<Button color={"green"} onClick={this.handleEdit}>Edit</Button> :
							<div>
								<Button color={"green"} onClick={this.handleSave}>Save</Button>
								<Button negative onClick={this.handleCancel}>Cancel</Button>
							</div>}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}