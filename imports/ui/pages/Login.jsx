import React from "react";
import {Meteor} from "meteor/meteor";
import { Link } from "react-router-dom";
import {Divider, Container, Button, Form, Grid, Header, Message, Segment, Label, Icon} from "semantic-ui-react";
import "../style/login.css";
import {BrowserRouter} from "react-router-dom";
import {browserHistory} from 'react-router';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ""
		};
	}
	onSubmit(e) {
		e.preventDefault();
		let username = e.target.username.value.trim();
		let password = e.target.password.value.trim();
		Meteor.loginWithPassword({username: username}, password, err => {
			if(err) {
				this.setState({
					error: "Login Failed. Please try again!"
				});
			} else {
				this.setState({
					error: ""
				});
				// this.props.history.push("/mypage");
				BrowserHistory.push('/Homepage');
			}
		});
	}

	render() {
		return (
			<div>
				<Container>
					<Grid
						textAlign = "center"
						style = {{height: "95vh"}}
						divided ="vertically"
						verticalAligh = "middle"
						id = "grid"
					>
						<Segment placeholder>
							<Grid columns={2} relaxed ="very" stackable>
								<Grid.Column>
									<Header
										as = "h2"
										textAlign ="center"
										id = "loginHeader"
									>
									Welcome! Please Login to Your Account!
									</Header>
									{this.state.error ? (
									<Label
										basic
										color = "red"
										pointing = "below"
										size = "huge"
									>
									{this.state.error}
									</Label>
									) : (undefined
									)}
									<Form
										size = "huge"
										onSubmit = {this.onSubmit.bind(this)}
										noValidate
									>
										<Form>
											<Form.Input
												fluid
												icon = "user"
												iconPosition = "left"
												type = "text"
												label = "Username"
												placeholder = "Username"
												size = "huge"
												name="username"
												id="username"
											/>
											<Form.Input
												fluid
												icon="lock"
												iconPosition="left"
												type="password"
												label="Password"
												placeholder = "Password"
												size = "huge"
												name="password"
												id="password"
											/>
											<Button
												content= "Login"
												primary
												size = "huge"
											/>
										</Form>
									</Form>
								</Grid.Column>

								<Grid.Column verticalAlign="middle">
									<Link to = "/signup">
										<Button content="Sign up" primary icon="signup" size="huge" />
									</Link>
								</Grid.Column>
							</Grid>
							<Divider vertical>Or</Divider>
						</Segment>
						{/*<Grid.Row columns = {2}>*/}
							{/*<Grid.Column>*/}
								{/*<Header*/}
									{/*as = "h2"*/}
									{/*textAlign ="center"*/}
									{/*id = "loginHeader"*/}
								{/*>*/}
									{/*Welcome! Please Login to Your Account!*/}
								{/*</Header>*/}
								{/*{this.state.error ? (*/}
									{/*<Label*/}
										{/*basic*/}
										{/*color = "red"*/}
										{/*pointing = "below"*/}
										{/*size = "huge"*/}
									{/*>*/}
										{/*{this.state.error}*/}
									{/*</Label>*/}
								{/*) : (undefined*/}
								{/*)}*/}
								{/*<Form*/}
									{/*size = "huge"*/}
									{/*onSubmit = {this.onSubmit.bind(this)}*/}
									{/*noValidate*/}
								{/*>*/}
									{/*<Segment stacked>*/}
										{/*<Form.Input*/}
											{/*fluid*/}
											{/*icon = "user"*/}
											{/*iconPosition = "left"*/}
											{/*type = "text"*/}
											{/*name = "username"*/}
											{/*placeholder = "Username"*/}
											{/*size = "huge"*/}
										{/*/>*/}
										{/*<Form.Input*/}
											{/*fluid*/}
											{/*icon = "lock"*/}
											{/*iconPosition = "left"*/}
											{/*placeholder = "password"*/}
											{/*name = "password"*/}
											{/*type = "password"*/}
											{/*size = "huge"*/}
										{/*/>*/}
										{/*<Button*/}
											{/*fluid*/}
											{/*size = "huge"*/}
											{/*id = "loginButton"*/}
										{/*>*/}
											{/*Login*/}
										{/*</Button>*/}
									{/*</Segment>*/}
								{/*</Form>*/}
								{/*<Message*/}
									{/*size = "huge"*/}
								{/*>*/}
									{/*Have not registered yet? {" "}*/}
									{/*<Link to = "/signup"> Sign up </Link>*/}
								{/*</Message>*/}
							{/*</Grid.Column>*/}
						{/*</Grid.Row>*/}
					</Grid>
				</Container>
			</div>
		);

	}
}