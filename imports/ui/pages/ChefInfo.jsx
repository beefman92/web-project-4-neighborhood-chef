import React, { Component } from "react";
import {Meteor} from "meteor/meteor";
import {Link, Redirect} from "react-router-dom";
import {withTracker} from "meteor/react-meteor-data";
import { Container, Button, Form, Grid, Header, Message, Segment, Label, Icon } from "semantic-ui-react";

//import {Segment, Header, Icon, Image, Container, Button, Message} from "semantic-ui-react";
import NavigationBar from "../components/NavigationBar";
import PropTypes from "prop-types";
import {Accounts} from "meteor/accounts-base";
import Recipe from "./Recipe";
//import {Grid} from "semantic-ui-react/dist/commonjs/collections/Grid";
//import {Form} from "semantic-ui-react/dist/commonjs/collections/Form";

export default class ChefInfo extends React.Component {
//class ChefInfo extends Component {
	constructor(props) {
		super(props);
	}

    onSubmit(e) {
        e.preventDefault();
        let chefID = Meteor.userId();
        let name = e.target.name.value.trim();
        let picture = e.target.picture.value.trim();
        let content = e.target.content.value.trim();
        let nutrition = e.target.nutrition.value.trim();
        let price = e.target.price.value.trim();
        let available_time = e.target.available_time.value.trim();

        console.log(chefID);
        console.log(name);
        console.log(content);

        Meteor.call("recipes.insert", chefID, name, content, (error) => {
            if (error !== undefined && error !== null) {
            } else {
            }
        });
    }
    render() {
        return (
            <div>
                <Container>
                    <NavigationBar />
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

                                <Form
                                    size = "huge"
                                    onSubmit = {this.onSubmit.bind(this)}
                                    onValidate
                                >
                                    <Segment stacked>
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "name"
                                            placeholder = "Name"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "url"
                                            name = "picture"
                                            placeholder = "Picture"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "content"
                                            placeholder = "Content"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "nutrition"
                                            placeholder = "Nutrition"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "price"
                                            placeholder = "Price"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "nutrition"
                                            placeholder = "Nutrition"
                                            size = "huge"
                                        />
                                        <Form.Input
                                            fluid
                                            iconPosition = "left"
                                            type = "text"
                                            name = "available_time"
                                            placeholder = "Available Time"
                                            size = "huge"
                                        />
                                        <Button fluid size = "huge" id = "accountButton">
                                            Upload Recipe
                                        </Button>
                                    </Segment>
                                </Form>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }

    /*
    render(){
        if (Meteor.user() === undefined || Meteor.user() === null) {
            return (
                <Redirect to={"/"}/>
            );
        }
        return (
            <div>
                <NavigationBar />
                <h2>Chef Information</h2>
                <div>{this.props.chef.name}</div>
                <div>{this.props.chef.description}</div>
                <div>{this.props.chef.address}</div>
                <div>{this.props.chef.phone}</div>
            </div>

        );
    }
    */
}


/*
ChefInfo.propTypes = {
    personal_info: PropTypes.object,
};

export default withTracker(() => {
    const handle = Meteor.subscribe("ChefInfo");
    return {
        chef: Chefs.find({},{
            sort:{
            }
        }).fetch(),
        user: Meteor.user(),
        ready: handle.ready()

    };
})(ChefInfo);
*/