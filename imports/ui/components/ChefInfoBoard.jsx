import React, { Component } from "react";
import {Grid, Segment, Button, Form, Message } from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { Chefs } from "../../api/chefs";

const READ_ONLY = 0;
const EDITABLE = 1;

class ChefInfoBoard extends Component {
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
			description: this.state.info.description,
			picture: this.state.info.picture,
			address: this.state.info.address,
			city: this.state.info.city,
			postcode: this.state.info.postcode,
			province: this.state.info.province,
			country: this.state.info.country,
			phone: this.state.info.phone,
		};
		Meteor.call("chef.update", newProfile, (error) => {
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
				name: this.props.chefInfo.name,
				description: this.props.chefInfo.description,
				picture: this.props.chefInfo.picture,
				phone: this.props.chefInfo.phone,
				address: this.props.chefInfo.address,
				city: this.props.chefInfo.city,
				postcode: this.props.chefInfo.postcode,
				province: this.props.chefInfo.province,
				country: this.props.chefInfo.country,
			}
		});
	}

	renderReadOnlyPersonalInfo() {
		return (
			<Segment.Group>
				<Segment color={"orange"}>
					Name: {this.props.chefInfo.name}
				</Segment>
				<Segment color={"orange"}>
					Description: {this.props.chefInfo.description}
				</Segment>
				<Segment color={"orange"}>
					Address: {this.props.chefInfo.address}
				</Segment>
				<Segment color={"orange"}>
					City: {this.props.chefInfo.city}
				</Segment>
				<Segment color={"orange"}>
					Postcode: {this.props.chefInfo.postcode}
				</Segment>
				<Segment color={"orange"}>
					Phone: {this.props.chefInfo.phone}
				</Segment>
			</Segment.Group>
		);
	}

	handleEdit() {
		this.setState({
			mode: EDITABLE,
			info: {
				name: this.props.chefInfo.name,
				description: this.props.chefInfo.description,
				picture: this.props.chefInfo.picture,
				phone: this.props.chefInfo.phone,
				address: this.props.chefInfo.address,
				city: this.props.chefInfo.city,
				postcode: this.props.chefInfo.postcode,
				province: this.props.chefInfo.province,
				country: this.props.chefInfo.country,
			}
		});
	}

	handleModifyForm(event) {
		const name = event.target.name;
		const value = event.target.value;
		const newInfo = Object.assign({}, this.state.info);
		newInfo[name] = value;
		console.log(newInfo);
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
							label={"Name"}
							name="name"
							value={this.state.info.name}
							placeholder="name"
							disabled={true}
							onChange={this.handleModifyForm}/>
						<Form.Input
							label={"Description"}
							name="description"
							value={this.state.info.description}
							placeholder="description"
							onChange={this.handleModifyForm}/>
						<Form.Input
							label={"Picture"}
							name="picture"
							value={this.state.info.picture}
							placeholder="picture"
							onChange={this.handleModifyForm}/>
						<Form.Input
							label={"Phone"}
							name="phone"
							value={this.state.info.phone}
							placeholder="phone"
							onChange={this.handleModifyForm}/>
					</Segment>
					<Segment>
						<Form.Input
							label={"Address"}
							fluid
							name="address"
							placeholder="address"
							value={this.state.info.address}
							onChange={this.handleModifyForm}
						/>
						<Form.Group widths={"equal"}>
							<Form.Input fluid label="City" name={"city"} placeholder="City" value={this.state.info.city} onChange={this.handleModifyForm}/>
							<Form.Input fluid label="Postcode" name={"postcode"} placeholder="Postcode" value={this.state.info.postcode} onChange={this.handleModifyForm}/>
						</Form.Group>
						<Form.Group widths={"equal"}>
							<Form.Input fluid label="Province/State" name={"province"} placeholder="Province/State" value={this.state.info.province} onChange={this.handleModifyForm}/>
							<Form.Input fluid label="Country" name={"country"} placeholder="Country" value={this.state.info.country} onChange={this.handleModifyForm}/>
						</Form.Group>
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
							<Button onClick={this.handleEdit} positive>Edit</Button> :
							<div>
								<Button onClick={this.handleSave} positive>Save</Button>
								<Button negative onClick={this.handleCancel}>Cancel</Button>
							</div>}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

ChefInfoBoard.propTypes = {
	chefInfo: PropTypes.object,
	ready: PropTypes.bool,
};

export default withTracker(() => {
	const handler = Meteor.subscribe("chefInfo", Meteor.userId());
	return {
		chefInfo: Chefs.findOne({_id: Meteor.userId()}),
		ready: handler.ready(),
	};
})(ChefInfoBoard);