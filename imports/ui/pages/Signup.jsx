import React from "react";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Container, Button, Form, Grid, Header, Message, Segment } from "semantic-ui-react";
import PropTypes from "prop-types";

import NavigationBar from "../components/NavigationBar";
import "../style/login.css";

export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}

	onSubmit(e) {
		e.preventDefault();
		const username = e.target.username.value.trim();
		const email = e.target.email.value.trim();
		const password = e.target.password.value.trim();
		const addressObject = {
			address: e.target.address.value.trim(),
			city: e.target.city.value.trim(),
			postcode: e.target.postcode.value.trim(),
			province: e.target.province.value.trim(),
			country: e.target.country.value.trim(),
		};
		const phone = e.target.phone.value.trim();

		if (password.length < 8) {
			return this.setState( {
				error: "Password must be more than 8 characters."
			});

		}
		let profile = {
			addressBook: [addressObject], phone: phone, is_chef: false,
		};
		Accounts.createUser(
			{username: username, email: email, password: password, profile: profile},
			err => {
				if (err) {
					this.setState( {
						error: err.reason
					});
				} else {
					this.setState({
						error: ""
					});
					this.props.history.push("/");
				}
			}
		);
	}

	render() {
		return (
			<div>
				<NavigationBar />
				<Container>
					<Grid
						textAlign = "center"
						style = {{ height: "50vh"}}
						divided = "vertically"
						verticalAlign = "middle"
						id = "grid"
					>
						<Grid.Row columns = {2}>
							<Grid.Column textAlign={"left"}>
								<Header as = "h2" textAlign = "center" id = "signupHeader">
								Sign Up
								</Header>
								{this.state.error ? (
									<label
										basic
										color = "red"
										pointing = "below"
										size = "huge"
									>
										{this.state.error}
									</label>
								) : (
									undefined
								)}
								<Form
									size = "huge"
									onSubmit = {this.onSubmit.bind(this)}
								>
									<Segment stacked>
										<label htmlFor="mail">Email</label>
										<Form.Input
											id={"mail"}
											fluid
											icon = "mail"
											iconPosition = "left"
											type = "email"
											name = "email"
											placeholder = "Email"
											size = "huge"
										/>
										<label htmlFor="username">Username</label>
										<Form.Input
											id={"username"}
											fluid
											icon = "user"
											iconPosition = "left"
											type = "text"
											name = "username"
											placeholder = "username"
											size = "huge"
										/>
										<label htmlFor="password">Password</label>
										<Form.Input
											id={"password"}
											fluid
											icon = "lock"
											iconPosition = "left"
											type = "password"
											name = "password"
											placeholder = "password"
											size = "huge"
										/>
										<label htmlFor="address">Address</label>
										<Form.Input
											id={"address"}
											fluid
											icon = "address book outline"
											iconPosition = "left"
											type = "address"
											name = "address"
											placeholder = "address"
											size = "huge"
										/>
										<Form.Group widths={"equal"}>
											<Form.Input fluid label="City" name={"city"} placeholder="City" />
											<Form.Input fluid label="Postcode" name={"postcode"} placeholder="Postcode" />
										</Form.Group>
										<Form.Group widths={"equal"}>
											<Form.Input fluid label="Province/State" name={"province"} placeholder="Province/State" />
											<Form.Input fluid label="Country" name={"country"} placeholder="Country" />
										</Form.Group>
										<label htmlFor="phone">Phone</label>
										<Form.Input
											id={"phone"}
											fluid
											icon = "phone"
											iconPosition = "left"
											type = "phone"
											name = "phone"
											placeholder = "phone"
											size = "huge"
										/>
										<Button fluid size = "huge" id = "accountButton">
										Create Account
										</Button>
									</Segment>
								</Form>
								<Message
									size = "huge"
								>
									If you already have an account? Please
									<Link to = "Login"> Login </Link>
								</Message>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
}

Signup.propTypes = {
	history: PropTypes.object,
};