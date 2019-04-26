import React, { Component } from "react";
import NavigationBar from "../components/NavigationBar";
import {Button, Container, Form, Grid, TextArea} from "semantic-ui-react";
import {Accounts} from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

export default class ChefSignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			username: "",
			password: "",
			chefName: "",
			phone: "",
			picture: "",
			description: "",
			address: "",
			city: "",
			postcode: "",
			province: "",
			country: "",
		};
	}

	handleChangeInfo(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.state);
		const userProfile = {
			phone: this.state.phone.trim(),
			addressBook: [{
				address: this.state.address.trim(),
				city: this.state.city.trim(),
				postcode: this.state.postcode.trim(),
				province: this.state.province.trim(),
				country: this.state.country.trim(),
			}]
		};
		Accounts.createUser(
			{username: this.state.username.trim(), email: this.state.email.trim(), password: this.state.password.trim(), profile: userProfile},
			err => {
				if (err) {
					this.setState( {
						error: err.reason
					});
				} else {
					const chefInfo = {};
					chefInfo.name = this.state.chefName.trim();
					chefInfo.description = this.state.description.trim();
					chefInfo.picture = this.state.picture.trim();
					chefInfo.optionAddress = {};
					chefInfo.optionAddress.address = this.state.address.trim();
					chefInfo.optionAddress.city = this.state.city.trim();
					chefInfo.optionAddress.postcode = this.state.postcode.trim();
					chefInfo.optionAddress.province = this.state.province.trim();
					chefInfo.optionAddress.country = this.state.country.trim();
					chefInfo.phone = this.state.phone.trim();
					console.log(chefInfo);
					Meteor.call("chefs.insert", chefInfo, (error) => {
						if (error === undefined || error === null) {
							this.props.history.push("/chefinfo");
						} else {
							console.log(error);
						}
					});
				}
			}
		);

	}

	render() {
		return (
			<div>
				<NavigationBar/>
				<Container>
					<Grid>
						<Grid.Row>
							<Grid.Column width={"16"}>
								<Form>
									<Form.Input
										label={"Email"}
										fluid
										// icon = "mail"
										// iconPosition = "left"
										type = "email"
										name = "email"
										placeholder = "Email"
										value={this.state.email}
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									<Form.Input
										label={"Username"}
										fluid
										// icon = "user"
										// iconPosition = "left"
										type = "text"
										name = "username"
										placeholder = "Username"
										value={this.state.username}
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									<Form.Input
										fluid
										label={"Password"}
										// icon = "lock"
										// iconPosition = "left"
										type = "password"
										name = "password"
										placeholder = "Password"
										value={this.state.password}
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									Give yourself a blasting name so that everyone can search and remember. This name will appear in search page.
									<Form.Input
										label={"Chef name"}
										name="chefName"
										// icon="user"
										// iconPosition = "left"
										value={this.state.chefName}
										placeholder="Chef name"
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									Customers will contact you via this phone.
									<Form.Input
										label={"Phone"}
										name="phone"
										value={this.state.phone}
										placeholder="XXX-XXX-XXXX"
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									A well-designed trademark will attract more customers.
									<Form.Input
										label={"Picture"}
										name="picture"
										value={this.state.picture}
										placeholder="Picture url"
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									What kind of cuisine are you good at? Why do you want to be a chef? Introduce yourself to your customer.
									<Form.Field
										control={TextArea}
										name={"description"}
										label="Introduction"
										value={this.state.description}
										placeholder="What do you want to say to your customer. "
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									<Form.Input
										label={"address"}
										fluid
										name="address"
										placeholder="Address"
										value={this.state.address}
										onChange={(e) => this.handleChangeInfo(e)}
									/>
									<Form.Group widths={"equal"}>
										<Form.Input fluid label="City" name={"city"} placeholder="City" value={this.state.city} onChange={(e) => this.handleChangeInfo(e)}/>
										<Form.Input fluid label="Postcode" name={"postcode"} placeholder="Postcode" value={this.state.postcode} onChange={(e) => this.handleChangeInfo(e)}/>
									</Form.Group>
									<Form.Group widths={"equal"}>
										<Form.Input fluid label="Province/State" name={"province"} placeholder="Province/State" value={this.state.province} onChange={(e) => this.handleChangeInfo(e)}/>
										<Form.Input fluid label="Country" name={"country"} placeholder="Country" value={this.state.country} onChange={(e) => this.handleChangeInfo(e)}/>
									</Form.Group>
									<Button positive onClick={(e) => this.handleSubmit(e)}>Submit</Button>
								</Form>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
}

ChefSignUp.propTypes = {
	history: PropTypes.object,
};