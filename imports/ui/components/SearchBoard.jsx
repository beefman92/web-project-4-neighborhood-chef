import React, { Component } from "react";
import { Container, Grid, Button, Card, Form } from "semantic-ui-react";
import { Meteor } from "meteor/meteor";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { Link } from "react-router-dom";

import "../style/search-bar.css";

const degreeToPixels = [ { zoom: 0, pixels: 1.7492 }, { zoom: 1, pixels: 3.4984 }, { zoom: 2, pixels: 6.9968 }, { zoom: 3, pixels: 13.9936 },
	{ zoom: 4, pixels: 27.9872 }, { zoom: 5, pixels: 55.9744 }, { zoom: 6, pixels: 111.9488 }, { zoom: 7, pixels: 223.8976 },
	{ zoom: 8, pixels: 447.7952 }, { zoom: 9, pixels: 895.5904 }, { zoom: 10, pixels: 1791.1808 }, { zoom: 11, pixels: 3582.3616 },
	{ zoom: 12, pixels: 7164.7232 }, { zoom: 13, pixels: 14329.4464 }, { zoom: 14, pixels: 28658.8928 }, { zoom: 15, pixels: 57317.7856 },
	{ zoom: 16, pixels: 114635.5712 }, { zoom: 17, pixels: 229271.1424 }, { zoom: 18, pixels: 458542.2848 }, { zoom: 19, pixels: 917084.5696 },
	{ zoom: 20, pixels: 1834169.1392 }, { zoom: 21, pixels: 3668338.2784 }, { zoom: 22, pixels: 7336676.5568 }, { zoom: 23, pixels: 14673353.1136 },
	{ zoom: 24, pixels: 29346706.2272 }];


export default class SearchBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: false,
			searchField: "",
			chefs: [],
			viewport: {
				latitude: 0.0,
				longitude: 0.0,
				width: 400,
				height: 400,
				zoom: 14,
			},
			currentLat: 0.0,
			currentLon: 0.0,
			token: "",
		};
		this.yRange = [];
		this.xRange = [];
	}


	componentDidMount() {
		Meteor.call("token.getMapToken", (error, result) => {
			this.setState({
				token: result,
			});
		});
		for (let i = 0; i < degreeToPixels.length; i++) {
			const obj = degreeToPixels[i];
			this.yRange.push(this.state.viewport.height / obj.pixels);
			this.xRange.push(this.state.viewport.width / obj.pixels);
		}
		navigator.geolocation.getCurrentPosition((position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			Meteor.call("chefs.getNearbyChefs", latitude, longitude, (error, result) => {
				const newViewport = Object.assign({}, this.state.viewport);
				newViewport.latitude = latitude;
				newViewport.longitude = longitude;
				if (result !== null && result.length > 0) {
					this.setState({
						viewport: newViewport,
						chefs: result.map(info => {return {info: info, highLight: false, recipes: []};}),
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

	renderChefList() {
		return this.state.chefs.map((chef, index) => {
			const className = chef.highLight ? "chef-list-item-hover" : "chef-list-item";
			const chefInfo = chef.info;
			const recipes = chef.recipes;
			return (
				<Card
					fluid
					className={className}
					key={chefInfo._id}
					onMouseOver={() => this.handleOnMouseOverOrOut(index)}
					onMouseOut={() => this.handleOnMouseOverOrOut(index)}>
					<Card.Content>
						<Card.Header><Link to={"/chef/" + chefInfo._id}>{chefInfo.name}</Link></Card.Header>
					</Card.Content>
					<Card.Content>
						<Card.Description>
							<b>Introduction: </b>{chefInfo.description}<br />
							<b>Address: </b>{chefInfo.address}<br />
							<b>Contact: </b>{chefInfo.phone}<br />
						</Card.Description>
					</Card.Content>
					{this.renderRecipe(recipes)}
				</Card>
			);
		});
	}

	renderRecipe(recipes) {
		if (recipes !== null && recipes.length > 0) {
			const content = recipes.map(recipe => {
				return (
					<li key={recipe._id}>
						<Link to={"/recipe/" + recipe._id}>{recipe.name}</Link>
					</li>
				);
			});
			return (
				<Card.Content>
					<ul className={"recipe-list"}>
						{content}
					</ul>
				</Card.Content>
			);
		} else {
			return "";
		}
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
		return (
			<ReactMapGL
				id={"theMap"}
				{...this.state.viewport}
				mapboxApiAccessToken={this.state.token}
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

	handleOnSubmit() {
		if (this.searchByFood) {
			Meteor.call("recipes.searchByName", this.state.searchField, (error, recipeResult) => {
				if (recipeResult !== null) {
					const keys = Object.keys(recipeResult);
					if (keys.length > 0) {
						Meteor.call("chefs.getByIds", keys, (error, chefResult) => {
							const newViewport = this.computeNewViewport(chefResult);
							const chefInfo = chefResult.map(chefInfo => {
								return {
									info: chefInfo,
									highLight: false,
									recipes: recipeResult[chefInfo._id],
								};
							});
							this.setState({
								chefs: chefInfo,
								viewport: newViewport,
							});
						});
					}
				}
			});
		} else {
			Meteor.call("chefs.searchByName", this.state.searchField, (error, result) => {
				if (result !== null && result.length > 0) {
					const newViewport = this.computeNewViewport(result);
					this.setState({
						chefs: result.map(info => {return {info: info, highLight: false, recipes: []};}),
						viewport: newViewport,
					});
				}
			});
		}
	}

	computeNewViewport(chefs) {
		let minLat = this.state.currentLat;
		let maxLat = this.state.currentLat;
		let minLon = this.state.currentLon;
		let maxLon = this.state.currentLon;
		for (let i = 0; i < chefs.length; i++) {
			const chef = chefs[i];
			if (chef.latitude < minLat) {
				minLat = chef.latitude;
			}
			if (chef.latitude > maxLat) {
				maxLat = chef.latitude;
			}
			if (chef.longitude < minLon) {
				minLon = chef.longitude;
			}
			if (chef.longitude > maxLon) {
				maxLon = chef.longitude;
			}
		}
		const result = {
			latitude: this.state.currentLat,
			longitude: this.state.currentLon,
			zoom: this.state.viewport.zoom,
		};
		let i = 0, j = 0;
		if (minLat !== maxLat) {
			const distance = Math.abs(minLat - maxLat);
			for (; i < this.yRange.length; i++) {
				if (this.yRange[i] < distance) {
					break;
				}
			}
			i--;
			result.latitude = (minLat + maxLat) / 2;
		}
		if (minLon !== maxLon) {
			const distance = Math.abs(minLon - maxLon);
			for (; j < this.xRange.length; j++) {
				if (this.xRange[j] < distance) {
					break;
				}
			}
			j--;
			result.longitude = (minLon + maxLon) / 2;
		}
		const index = i < j ? i : j;
		result.zoom = index;

		const newViewport = Object.assign({}, this.state.viewport);
		newViewport.latitude = result.latitude;
		newViewport.longitude = result.longitude;
		newViewport.zoom = result.zoom;
		return newViewport;
	}

	render() {
		return (
			<Container>
				<Grid>
					<Grid.Row divided>
						<Grid.Column width={"10"}>
							{this.renderChefList()}
						</Grid.Column>
						<Grid.Column width={"6"}>
							{this.state.token !== null && this.state.token !== "" ? this.renderMap() : "Map is loading. Please wait. "}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}