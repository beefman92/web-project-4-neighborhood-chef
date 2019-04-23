import React, { Component } from "react";
import {Button, Container, Grid, Menu} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {Link} from "react-router-dom";

import "../style/homepage.css";

const OPTION_FOOD = 0;
const OPTION_CHEF = 1;

export default class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchOption: OPTION_FOOD,
			addressOptions: ["hahahaha"],
			find: "",
			near: "",
		};
	}

	handleSearch(event) {
		event.preventDefault();
	}

	handleClickOption(option) {
		if (option === OPTION_FOOD) {
			this.setState({
				searchOption: OPTION_FOOD,
			});
		} else if (option === OPTION_CHEF) {
			this.setState({
				searchOption: OPTION_CHEF,
			});
		}
	}

	componentDidMount() {
		this.getCurrentLocation();
	}

	getCurrentLocation() {
		navigator.geolocation.getCurrentPosition((position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			Meteor.call("chefs.getAddress", latitude, longitude, (error, result) => {
				if (result !== undefined && result !== null) {
					const addressOptions = result.features.map(value => value.place_name);
					this.setState({
						addressOptions: addressOptions,
					});
				}
			});
		});
	}

	renderHomepageNavBar() {
		return (
			<Menu className={"homepage-menu"} inverted>
				<Container>
					<Menu.Item header>NeighborChef</Menu.Item>
					<Menu.Item>
						<Link className={"homepage-menu-button-wrapper"} to={"/"}><Button className={"homepage-menu-button"}>Home</Button></Link>
					</Menu.Item>
					{this.renderMenu()}
				</Container>
			</Menu>
		);
	}

	renderMenu() {
		if (!Meteor.user()) {
			return (
				<Menu.Menu position="right">
					<Menu.Item>
						<Link className={"homepage-menu-button-wrapper"} to={"/signup"}><Button className={"homepage-menu-button"}>Sign Up</Button></Link>
					</Menu.Item>
					<Menu.Item>
						<Link className={"homepage-menu-button-wrapper"} to={"/login"}><Button className={"homepage-menu-button"}>Login</Button></Link>
					</Menu.Item>
				</Menu.Menu>
			);
		} else {
			return (
				<Menu.Menu position="right">
					<Menu.Item>
						<Button onClick={() => {Meteor.logout(() => {this.forceUpdate();});}}>Logout</Button>
					</Menu.Item>
					<Menu.Item>
						<Link to={"/mypage"}><Button color={"blue"}>User Page</Button></Link>
					</Menu.Item>
					{Meteor.user().profile.is_chef ?
						<Menu.Item>
							<Link to={"/chefinfo"}><Button color={"blue"}>Chef Page</Button></Link>
						</Menu.Item>
						: ""}
				</Menu.Menu>
			);
		}
	}

	renderSearchOptions() {
		const foodClassName = "search-input-option" + (this.state.searchOption === OPTION_FOOD ? " search-input-option-active" : "");
		const chefClassName = "search-input-option" + (this.state.searchOption === OPTION_CHEF ? " search-input-option-active" : "");
		return (
			<div className={"search-input-item-wrapper"}>
				<div className={foodClassName} onClick={() => this.handleClickOption(OPTION_FOOD)}>Food</div>
				<div className={chefClassName} onClick={() => this.handleClickOption(OPTION_CHEF)}>Chef</div>
			</div>
		);
	}

	handleInputOnChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	renderSearchBar() {
		let findPlaceholder = "";
		if (this.state.searchOption === OPTION_FOOD) {
			findPlaceholder = "Burgers, noodles, tacos...";
		} else if (this.state.searchOption === OPTION_CHEF) {
			findPlaceholder = "Chef xxx is popular...";
		}
		const nearPlaceholder = "Pick or enter your address";
		return (
			<div className={"search-input-wrapper"}>
				<label className={"search-input-label search-input-label-left"}>
					<span className={"search-input-label-content"}>Find</span>
					<input
						className={"search-input"}
						placeholder={findPlaceholder}
						name={"find"}
						value={this.state.find}
						type="text"
						onChange={(e) => this.handleInputOnChange(e)}/>
				</label>
				<label className={"search-input-label search-input-label-right"}>
					<span className={"search-input-label-content"}>Near</span>
					<input
						className={"search-input"}
						placeholder={nearPlaceholder}
						name={"near"}
						value={this.state.near}
						type="text"
						onChange={(e) => this.handleInputOnChange(e)}/>
				</label>
				<button className={"search-input-button"} onClick={(e) => this.handleSearch(e)}>
					<img className={"search-input-button-image"} src={"/images/search.svg"} alt={"search button"} onClick={(e) => this.handleSearch(e)}/>
				</button>
			</div>
		);
	}

	handleClickAddressOption(index) {
		const address = this.state.addressOptions[index];
		this.setState({
			addressOptions: [],
			near: address,
		});
	}

	renderAddressOptions() {
		if (this.state.addressOptions.length > 0 && this.state.near === "") {
			return (
				<div className={"address-options-wrapper"}>
					<div className={"address-options-placeholder"}>{""}</div>
					<div className={"address-options-list"}>
						{this.state.addressOptions.map((value, index) => {
							return (
								<div className={"address-options-item"} key={index} onClick={() => this.handleClickAddressOption(index)}>
									{value}
								</div>
							);
						})}
					</div>
				</div>
			);
		} else {
			return "";
		}
	}

	render() {
		return (
			<div>
				<div className={"top-part-background-image"}>
					<div className={"top-part-shadow"}>
						<div className={"top-part"}>
							{this.renderHomepageNavBar()}
							<Container>
								<Grid>
									<Grid.Row className={"trademark-row"}>
										<Grid.Column textAlign={"center"} width={"16"}>
											<div style={{height: "100px"}}>
												<div className={"trademark-title"}>
													<h1>NeighborChef</h1>
												</div>
												<img className={"trademark-icon"} src="/images/chef-hat.svg" alt="website trademark"/>
											</div>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column width={"16"}>
											{this.renderSearchOptions()}
											{this.renderSearchBar()}
											{this.renderAddressOptions()}
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Container>
						</div>
					</div>
				</div>
				<div className={"bottom-part"}>
					<Container>
						<Grid>
							<Grid.Row>
								<Grid.Column width={"16"}>
									<h2>Popular & New Business Around You</h2>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
				</div>
			</div>
		);
	}
}