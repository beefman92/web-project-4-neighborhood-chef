import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Form, Grid, Header, Message, Segment, Label, Icon } from "semantic-ui-react";
import "../style/login.css";

export default class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}

	onSubmit(e) {
		e.preventDafault();
		let username = e.target.username.value.trim();
		let email = e.target.email.value.trim();
		let password = e.target.password.value.trim();

		if (password.length < 8) {
			return this.setState( {
				error: "Password must be more than 8 characters."
			});

		}
		Accounts.createUser(
			{username: username, email: email, password: password},
			err => {
				if(err) {
					this.setState( {
						error: err.reason
						});
				} else {
					this.setState({
						error: ""
					});
				}
			}
		);
	}

	render() {
		return (
			<div>
				<Container>
					<Grid
						textAlign = "center"
						style = {{ height: "95vh"}}
						divided = "vertically"
						verticalAlign = "middle"
						id = "grid"
					>
						<Grid.Row columns = {2}>
						 <Grid.Column>
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
								onValidate
							>
								<Segment stacked>
									<Form.Input
										fluid
										icon = "mail"
										iconPosition = "left"
										type = "email"
										name = "email"
										placeholder = "Email"
										size = "huge"
									/>
									<Form.Input
										fluid
										icon = "user"
										iconPosition = "left"
										type = "text"
										name = "username"
										placeholder = "username"
										size = "huge"
									/>
									<Form.Input
										fluid
										icon = "user"
										iconPosition = "left"
										type = "text"
										placeholder = "username"
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