import React, { Component } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { Link } from "react-router-dom";

import "../style/homepage.css";

const mapboxToken = "";

export default class SearchBoard extends Component {
	constructor(props) {
		super(props);
		// console.log("Construct SearchBoard");
		this.state = {
			search: false,
			searchField: "",
			chefs: [],
			viewport: {
				latitude: 0.0,
				longitude: 0.0,
				width: 600,
				height: 600,
				zoom: 15,
			},
			currentLat: 0.0,
			currentLon: 0.0,
		};
	}

	componentDidMount() {
		// console.log("SearchBoard did mount");
		navigator.geolocation.getCurrentPosition((position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			Meteor.call("chefs.getNearbyChefs", latitude, longitude, (error, result) => {
				const newViewport = Object.assign({}, this.state.viewport);
				newViewport.latitude = latitude;
				newViewport.longitude = longitude;
				if (result !== null && result.length > 0) {
					this.setState({viewport: newViewport,
						chefs: result.map(info => {return {info: info, highLight: false};}),
						currentLat: latitude,
						currentLon: longitude});
				} else {
					this.setState({
						viewport: newViewport,
						currentLat: latitude,
						currentLon: longitude});
				}
			});
		});
	}

	componentWillUnmount() {
		// console.log("SearchBoard will unmount");
	}

	renderChefList() {
		// console.log("renderChefList");
		return this.state.chefs.map((chef, index) => {
			const className = chef.highLight ? "chef-list-item-hover" : "chef-list-item";
			const chefInfo = chef.info;
			return (
				<Card
					className={className}
					key={chefInfo._id}
					onMouseOver={() => this.handleOnMouseOverOrOut(index)}
					onMouseOut={() => this.handleOnMouseOverOrOut(index)}>
					<Card.Body>
						<Card.Title><Link to={"/chef/" + chefInfo._id}>{chefInfo.name}</Link></Card.Title>
						<Card.Subtitle className="mb-2 text-muted">{chefInfo.description}</Card.Subtitle>
						<Card.Text>
							<b>Address: </b>{chefInfo.address}<br />
							<b>Contact: </b>{chefInfo.phone}<br />
						</Card.Text>
					</Card.Body>
				</Card>
			);
		});
	}

	handleOnMouseOverOrOut(index) {
		const newChefs = this.state.chefs.slice();
		newChefs[index].highLight = !newChefs[index].highLight;
		this.setState({chefs: newChefs});
	}

	handleOnViewportChange(viewport) {
		this.setState({viewport: viewport});
	}

	renderMap() {
		// console.log("renderMap");
		return (
			<ReactMapGL
				{...this.state.viewport}
				mapboxApiAccessToken={mapboxToken}
				mapStyle={"mapbox://styles/mapbox/navigation-guidance-day-v4"}
				onViewportChange={(v) => this.handleOnViewportChange(v)}>
				<div style={{position: "absolute", top: 36, left: 0, padding: "10px"}}>
					<NavigationControl onViewportChange={(v) => this.handleOnViewportChange(v)}/>
				</div>
				{this.renderCurrentPosition()}
				{this.renderPins()}
			</ReactMapGL>
		);
	}

	renderCurrentPosition() {
		return (
			<Marker key={"current-position"} latitude={this.state.currentLat} longitude={this.state.currentLon}>
				<div id={"currentPosition"} />
			</Marker>
		);
	}

	renderPins() {
		// console.log("renderPins");
		return this.state.chefs.map((chef, index) => {
			const className = chef.highLight ? "pin-picture-hover" : "pin-picture";
			const chefInfo = chef.info;
			return (
				<Marker key={chefInfo._id} latitude={chefInfo.latitude} longitude={chefInfo.longitude}>
					<img
						className={className}
						src={"/images/pin.png"}
						alt={"icon of chef " + chefInfo.name}
						onMouseOver={() => this.handleOnMouseOverOrOut(index)}
						onMouseOut={() => this.handleOnMouseOverOrOut(index)} />
				</Marker>
			);
		});
	}

	handleOnChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	handleOnKeyDown(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.handleOnSubmit();
		}
	}

	handleOnSubmit() {
		Meteor.call("recipes.searchByName", this.state.searchField, (error, result) => {
			if (result != null) {

			} else {

			}
		});
	}

	render() {
		// console.log("SearchBoard render");
		return (
			<div>
				<Row className={"my-5"}>
					<Col lg={"2"}>
						Anything want to eat:
					</Col>
					<Col lg="8">
						<Form.Control
							name={"searchField"}
							value={this.state.searchField}
							onChange={(e) => this.handleOnChange(e)}
							onKeyDown={(e) => this.handleOnKeyDown(e)} />
					</Col>
					<Col lg={"2"}>
						<Button variant={"success"} onClick={() => this.handleOnSubmit()}>Search</Button>
					</Col>
				</Row>
				<Row>
					<Col lg={"5"}>
						{this.renderChefList()}
					</Col>
					<Col lg={"7"}>
						{this.renderMap()}
					</Col>
				</Row>
			</div>
		);
	}
}