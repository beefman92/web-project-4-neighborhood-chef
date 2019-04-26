import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import { Redirect } from "react-router-dom";
import {Segment, Button, Grid, Container, Menu, Modal, Header, Form, TextArea, Radio} from "semantic-ui-react";
import PropTypes from "prop-types";

import NavigationBar from "../components/NavigationBar";
import CustomerOrderBoard from "../components/CustomerOrderBoard";
import CustomerInfoBoard from "../components/CustomerInfoBoard";
import Footer from "../components/Footer";

const INFO = "INFO";
const ORDERS = "ORDERS";

export default class MyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChef: false,
			activeItem: INFO,
			chefInfoConfirm: false,
			info: {
				name: "",
				description: "",
				picture: "",
				phone: "",
				optionAddress: [],
			},
			index: 0,
		};
	}

	renderChefInfoLink() {
		if (Meteor.user().profile.is_chef || this.state.isChef) {
			return (
				""
			);
		} else {
			return  (
				<Button color={"green"} onClick={() => {this.handleCreateNewChef();}}>
					I want to be a chef!
				</Button>
			);
		}
	}

	handleCreateNewChef() {
		const optionAddress = Meteor.user().profile.addressBook.map((value) => {
			return Object.assign({}, value);
		});
		optionAddress.push({
			address: "",
			city: "",
			postcode: "",
			province: "",
			country: "",
		});
		this.setState({
			chefInfoConfirm: true,
			info: {
				name: "",
				description: "",
				picture: "",
				phone: Meteor.user().profile.phone,
				optionAddress: optionAddress,
			}
		});
	}

	handleConfirm(event) {
		event.preventDefault();
		const newInfo = Object.assign({}, this.state.info);
		newInfo.optionAddress = newInfo.optionAddress[this.state.index];
		Meteor.call("chefs.insert", newInfo, (error) => {
			if (error === undefined || error === null) {
				this.props.history.push("/chefinfo");
			}
		});
	}

	handleCancel(event) {
		event.preventDefault();
		this.setState({
			chefInfoConfirm: false,
			info: {
				name: "",
				description: "",
				picture: "",
				phone: "",
				optionAddress: [],
			},
			index: 0,
		});
	}

	handleChangeSubPage(data) {
		this.setState({
			activeItem: data.name
		});
	}

	handleChangeInfo(event) {
		const newInfo = Object.assign({}, this.state.info);
		newInfo[event.target.name] = event.target.value;
		this.setState({
			info: newInfo,
		});
	}

	renderChefInfoConfirm() {
		return (
			<Modal open={this.state.chefInfoConfirm}>
				<Modal.Header>Confirm information</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Header>Before starting the journey of a chef, please check your information</Header>
						<Form>
							<Segment.Group>
								<Segment>
									Give yourself a blasting name so that everyone can search and remember.
									<Form.Input
										label={"Chef name"}
										name="name"
										value={this.state.info.name}
										placeholder="chef name"
										onChange={(e) => this.handleChangeInfo(e)}
									/>
								</Segment>
								<Segment>
									A well-designed trademark will attract more customers.
									<Form.Input
										label={"Picture"}
										name="picture"
										value={this.state.info.picture}
										placeholder=""
										onChange={(e) => this.handleChangeInfo(e)}
									/>
								</Segment>
								<Segment>
									What kind of cuisine are you good at? Why do you want to be a chef? Introduce yourself to your customer.
									<Form.Field
										control={TextArea}
										name={"description"}
										label="Introduction"
										value={this.state.info.description}
										placeholder="What do you want to say to your customer. "
										onChange={(e) => this.handleChangeInfo(e)}
									/>
								</Segment>
								<Segment>
									Customers will contact you via this phone.
									<Form.Input
										label={"Phone"}
										name="phone"
										value={this.state.info.phone}
										placeholder="XXX-XXX-XXXX"
										onChange={(e) => this.handleChangeInfo(e)}
									/>
								</Segment>
								<Segment>
									<Segment.Group>
										{this.renderOptionAddressBook()}
									</Segment.Group>
								</Segment>
							</Segment.Group>
							<Button negative onClick={(e) => this.handleCancel(e)}>Cancel</Button>
							<Button positive onClick={(e) => this.handleConfirm(e)}>Confirm</Button>
						</Form>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		);
	}

	handleOptionChange(index) {
		this.setState({
			index: index,
		});
	}

	handleChangeOptionAddress(event, index) {
		const newInfo = Object.assign({}, this.state.info);
		const newOptionAddress = newInfo.optionAddress.slice();
		const newAddressObject = Object.assign({}, newOptionAddress[index]);
		newAddressObject[event.target.name] = event.target.value;
		newOptionAddress[index] = newAddressObject;
		newInfo.optionAddress = newOptionAddress;
		this.setState({
			info: newInfo
		});
	}

	renderOptionAddressBook() {
		return this.state.info.optionAddress.map((value, index) => {
			const active = (this.state.index === index);
			const lastOne = index === this.state.info.optionAddress.length - 1;
			let optionLabel = "";
			if (lastOne) {
				optionLabel = "Use new address";
			} else {
				optionLabel = "User address " + (index + 1);
			}
			return (
				<Segment key={index}>
					<Form.Field
						control={Radio}
						label={optionLabel}
						value={"" + index}
						checked={active}
						onChange={() => this.handleOptionChange(index)}
					/>
					<Form.Input
						label={"address"}
						fluid
						name="address"
						placeholder="address"
						value={this.state.info.optionAddress[index].address}
						disabled={!active}
						onChange={(e) => this.handleChangeOptionAddress(e, index)}
					/>
					<Form.Group widths={"equal"}>
						<Form.Input fluid label="City" name={"city"} placeholder="City" value={this.state.info.optionAddress[index].city} disabled={!active} onChange={(e) => this.handleChangeOptionAddress(e, index)}/>
						<Form.Input fluid label="Postcode" name={"postcode"} placeholder="Postcode" value={this.state.info.optionAddress[index].postcode} disabled={!active} onChange={(e) => this.handleChangeOptionAddress(e, index)}/>
					</Form.Group>
					<Form.Group widths={"equal"}>
						<Form.Input fluid label="Province/State" name={"province"} placeholder="Province/State" value={this.state.info.optionAddress[index].province} disabled={!active} onChange={(e) => this.handleChangeOptionAddress(e, index)}/>
						<Form.Input fluid label="Country" name={"country"} placeholder="Country" value={this.state.info.optionAddress[index].country} disabled={!active} onChange={(e) => this.handleChangeOptionAddress(e, index)}/>
					</Form.Group>
				</Segment>
			);
		});
	}

	render() {
		if (Meteor.user()) {
			return (
				<div>
					<NavigationBar/>
					<Container>
						<Grid>
							<Grid.Row divided>
								<Grid.Column width={"3"}>
									<img style={{width: "100px", borderRadius: "50%"}} src="/images/pacman.svg" alt="user's profile picture"/>
								</Grid.Column>
								<Grid.Column width={"13"}>
									<Segment.Group>
										<Segment>
											<h2>Personal Information</h2>
										</Segment>
										<Segment textAlign={"right"}>
											{this.renderChefInfoLink()}
										</Segment>
									</Segment.Group>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={3}>
									<Menu fluid vertical pointing>
										<Menu.Item
											color={"orange"}
											name={INFO}
											active={this.state.activeItem === INFO}
											onClick={(e, data) => this.handleChangeSubPage(data)} />
										<Menu.Item
											color={"orange"}
											name={ORDERS}
											active={this.state.activeItem === ORDERS}
											onClick={(e, data) => this.handleChangeSubPage(data)} />
									</Menu>
								</Grid.Column>
								<Grid.Column width={13}>
									{this.state.activeItem === INFO ? <CustomerInfoBoard /> : <CustomerOrderBoard />}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
					{Meteor.user().profile.is_chef ? "" : this.renderChefInfoConfirm()}
					<Footer/>
				</div>
			);
		} else {
			return (<Redirect to={"/login"}/>);
		}
	}
}

MyPage.propTypes = {
	history: PropTypes.object,
};