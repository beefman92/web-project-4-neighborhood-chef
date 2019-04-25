import React, { Component } from "react";
import {Grid, Segment, Button, Form, Message } from "semantic-ui-react";
import {Meteor} from "meteor/meteor";

import "../style/my-page.css";

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
		const addressBook = [];
		this.state.info.addressBook.forEach((value) => {
			if (value !== undefined && value !== null) {
				addressBook.push(value);
			}
		});
		const newProfile = {
			phone: this.state.info.phone,
			addressBook: addressBook,
		};
		Meteor.call("users.updateProfile", newProfile, (error) => {
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
				phone: Meteor.user().profile.phone,
				addressBook: Meteor.user().profile.addressBook,
			}
		});
	}

	renderReadOnlyPersonalInfo() {
		return (
			<Segment color={"orange"}>
				<div>
					Username: {Meteor.user().username}
				</div>
				<div>
					Phone Number: {Meteor.user().profile.phone}
				</div>
				<div>
					{Meteor.user().profile.addressBook !== undefined ? Meteor.user().profile.addressBook.map((value, index) => {
						return (
							<div key={index}>
								{"Address " + (index + 1) + ": " + value.address + ", " + value.city + ", "
								+ value.province + " " + value.postcode + ", " + value.country}
							</div>
						);
					}) : ""}
				</div>
			</Segment>
		);
	}

	handleEdit() {
		this.setState({
			mode: EDITABLE,
			info: {
				username: Meteor.user().username,
				phone: Meteor.user().profile.phone,
				addressBook: Meteor.user().profile.addressBook,
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
							disabled
							onChange={this.handleModifyForm}/>
						<Form.Input
							label={"phone"}
							name="phone"
							value={this.state.info.phone}
							placeholder="XXX-XXX-XXXX"
							onChange={this.handleModifyForm}/>
					</Segment>
					{this.renderEditableAddressBook()}
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

	renderEditableAddressBook() {
		const addressBook = this.state.info.addressBook !== undefined ? this.state.info.addressBook.map((value, index) => {
			if (value === undefined || value === null) {
				return "";
			} else {
				return (
					<Segment key={index}>
						{"Address " + (index + 1)}
						<div className={"button-align-to-right"}>
							<Button negative onClick={() => this.handleDeleteAddress(index)}>Delete</Button>
						</div>
						<Form.Input
							label={"address"}
							fluid
							name = "address"
							placeholder = "address"
							value={this.state.info.addressBook[index].address}
							onChange={(e) => this.handleAddressBookOnChange(e, index)}
						/>
						<Form.Group widths={"equal"}>
							<Form.Input fluid label="City" name={"city"} placeholder="City" value={this.state.info.addressBook[index].city} onChange={(e) => this.handleAddressBookOnChange(e, index)} />
							<Form.Input fluid label="Postcode" name={"postcode"} placeholder="Postcode" value={this.state.info.addressBook[index].postcode} onChange={(e) => this.handleAddressBookOnChange(e, index)} />
						</Form.Group>
						<Form.Group widths={"equal"}>
							<Form.Input fluid label="Province/State" name={"province"} placeholder="Province/State" value={this.state.info.addressBook[index].province} onChange={(e) => this.handleAddressBookOnChange(e, index)} />
							<Form.Input fluid label="Country" name={"country"} placeholder="Country" value={this.state.info.addressBook[index].country} onChange={(e) => this.handleAddressBookOnChange(e, index)} />
						</Form.Group>
					</Segment>
				);
			}
		}) : "";
		return (
			<div>
				{addressBook}
				<div className={"button-align-to-right"}>
					<Button positive onClick={() => this.handleAddNewAddress()}>+Address</Button>
				</div>

			</div>
		);
	}

	handleDeleteAddress(index) {
		const newAddressBook = this.state.info.addressBook.slice();
		const newInfo = Object.assign({}, this.state.info);
		newAddressBook[index] = null;
		newInfo.addressBook = newAddressBook;
		this.setState({
			info: newInfo,
		});
	}

	handleAddressBookOnChange(event, index) {
		const newAddressBook = this.state.info.addressBook.slice();
		const newAddressObject = Object.assign({}, newAddressBook[index]);
		const newInfo = Object.assign({}, this.state.info);
		newAddressObject[event.target.name] = event.target.value;
		newAddressBook[index] = newAddressObject;
		newInfo.addressBook = newAddressBook;
		this.setState({
			info: newInfo,
		});
	}

	handleAddNewAddress() {
		let newAddressBook;
		if (this.state.info.addressBook === undefined || this.state.info.addressBook === null) {
			newAddressBook = [];
		} else {
			newAddressBook = this.state.info.addressBook.slice();
		}
		const newInfo = Object.assign({}, this.state.info);
		const newAddressObject = {
			address: "",
			city: "",
			postcode: "",
			province: "",
			country: "",
		};
		newAddressBook.push(newAddressObject);
		newInfo.addressBook = newAddressBook;
		this.setState({
			info: newInfo,
		});
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