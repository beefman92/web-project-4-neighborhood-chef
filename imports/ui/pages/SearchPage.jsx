import React, { Component } from "react";
import { Container, Grid, Card } from "semantic-ui-react";
import SearchBar from "../components/SearchBar";
import NavigationBar from "../components/NavigationBar";
import {Meteor} from "meteor/meteor";
import {Link} from "react-router-dom";
import ReactMapGL, {Marker, NavigationControl} from "react-map-gl";
import PropTypes from "prop-types";

import { OPTION_FOOD, OPTION_CHEF } from "../components/SearchBar";
import "../style/search-page.css";
import CroppedImage from "../components/CroppedImage";

const degreeToPixels = [ { zoom: 0, pixels: 1.7492 }, { zoom: 1, pixels: 3.4984 }, { zoom: 2, pixels: 6.9968 }, { zoom: 3, pixels: 13.9936 },
	{ zoom: 4, pixels: 27.9872 }, { zoom: 5, pixels: 55.9744 }, { zoom: 6, pixels: 111.9488 }, { zoom: 7, pixels: 223.8976 },
	{ zoom: 8, pixels: 447.7952 }, { zoom: 9, pixels: 895.5904 }, { zoom: 10, pixels: 1791.1808 }, { zoom: 11, pixels: 3582.3616 },
	{ zoom: 12, pixels: 7164.7232 }, { zoom: 13, pixels: 14329.4464 }, { zoom: 14, pixels: 28658.8928 }, { zoom: 15, pixels: 57317.7856 },
	{ zoom: 16, pixels: 114635.5712 }, { zoom: 17, pixels: 229271.1424 }, { zoom: 18, pixels: 458542.2848 }, { zoom: 19, pixels: 917084.5696 },
	{ zoom: 20, pixels: 1834169.1392 }, { zoom: 21, pixels: 3668338.2784 }, { zoom: 22, pixels: 7336676.5568 }, { zoom: 23, pixels: 14673353.1136 },
	{ zoom: 24, pixels: 29346706.2272 }];

export default class SearchPage extends Component {
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

		if (this.props.history.location.state !== undefined
			&& this.props.history.location.state !== null
			&& this.props.history.location.state.near) {
			const option = this.props.history.location.state.option;
			const find = this.props.history.location.state.find;
			const near = this.props.history.location.state.near;

			this.search(option, find, near);
		} else {
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
							chefs: result.map(info => {
								return {info: info, highLight: false, recipes: []};
							}),
							currentLat: latitude,
							currentLon: longitude
						});
					} else {
						this.setState({
							viewport: newViewport,
							currentLat: latitude,
							currentLon: longitude
						});
					}
				});
			});
		}
	}

	search(option, find, near) {
		if (option === OPTION_FOOD) {
			Meteor.call("recipes.search", find, near, (error, result) => {
				// result: {latitude: xxx, longitude: xxx, searchResult{chefId1: {chefInfo: chef1, recipeList: [recipe1, recipe2]}, chefId2: {...}, ...}}
				if (result !== undefined && result !== null) {
					const latitude = result.latitude;
					const longitude = result.longitude;
					const searchResult = result.searchResult;
					const keys = Object.keys(searchResult);
					const stateChefs = [];
					const chefs = keys.map((id) => {
						const result = searchResult[id];
						stateChefs.push({
							info: result.chefInfo,
							highLight: false,
							recipes: searchResult[id].recipeList,
						});
						return result.chefInfo;
					});
					const newViewport = this.computeNewViewport(chefs, latitude, longitude);
					this.setState({
						chefs: stateChefs,
						viewport: newViewport,
						currentLat: latitude,
						currentLon: longitude,
					});
				}
			});
		} else if (option === OPTION_CHEF) {
			Meteor.call("chefs.search", find, near, (error, result) => {
				// result: [latitude: xxx, longitude: xxx, searchResult: [chef1, chef2, ...]}
				const latitude = result.latitude;
				const longitude = result.longitude;
				const newViewport = this.computeNewViewport(result.searchResult, latitude, longitude);
				const stateChefs = result.searchResult.map((chef) => {
					return {
						info: chef,
						highLight: false,
						recipes: [],
					};
				});
				this.setState({
					chefs: stateChefs,
					viewport: newViewport,
					currentLat: latitude,
					currentLon: longitude,
				});
			});
		}
	}

	renderChefList() {
		return this.state.chefs.map((chef, index) => {
			const className = chef.highLight ? "chef-list-item-hover" : "chef-list-item";
			const chefInfo = chef.info;
			const recipes = chef.recipes;
			let pictureUrl = "";
			if (!chefInfo.picture) {
				pictureUrl = "https://st2.depositphotos.com/4908849/9632/v/950/depositphotos_96323190-stock-illustration-italian-chef-vector.jpg";
			} else {
				pictureUrl = chefInfo.picture;
			}

			return (
				<Grid.Row key={chefInfo._id}>
					<Grid.Column verticalAlign={"middle"} width={"4"}>
						<CroppedImage
							url={pictureUrl}
							height={"100px"}
							alt={"chef picture"}
							onClick={() => {this.props.history.push(/chef/ + chefInfo._id);}}/>
					</Grid.Column>
					<Grid.Column width={"12"}>
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
					</Grid.Column>

				</Grid.Row>
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
			<div className={"map-wrapper"}>
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
			</div>
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

	computeNewViewport(chefs, currentLat, currentLon) {
		let minLat = currentLat;
		let maxLat = currentLat;
		let minLon = currentLon;
		let maxLon = currentLon;
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

	handleSubmit(event, data) {
		if (data.find && data.near) {
			this.search(data.option, data.find, data.near);
		}
	}

	render() {
		let searchBarInit = {
			option: OPTION_FOOD,
			find: "",
			near: "",
		};
		if (this.props.history.location.state !== undefined && this.props.history.location.state !== null) {
			searchBarInit.option = this.props.history.location.state.option;
			searchBarInit.find = this.props.history.location.state.find;
			searchBarInit.near = this.props.history.location.state.near;
		}
		return (
			<div>
				<NavigationBar />
				<Container>
					<Grid>
						<SearchBar
							option={searchBarInit.option}
							find={searchBarInit.find}
							near={searchBarInit.near}
							onSubmit={(e, d) => this.handleSubmit(e, d)}/>
						<Grid.Row divided>
							<Grid.Column width={"10"}>
								<div><h2>All Results</h2></div>
								<Grid padded>
									{this.renderChefList()}
								</Grid>
							</Grid.Column>
							<Grid.Column width={"6"}>
								{this.state.token !== null && this.state.token !== "" ? this.renderMap() : "Map is loading. Please wait. "}
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
}

SearchPage.propTypes = {
	history: PropTypes.object,
};