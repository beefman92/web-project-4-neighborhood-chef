import React, { Component } from "react";
import {Button, Container, Grid, Menu} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {Link} from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Card } from "semantic-ui-react";

import CroppedImage from "../components/CroppedImage";
import {OPTION_FOOD, OPTION_CHEF} from "../components/SearchBar";
import "../style/homepage.css";

class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchOption: OPTION_FOOD,
			usualAddressOptions: [],
			recommendAddressOptions: [],
			find: "",
			near: "",
			currentCity: "",
			nearBusiness: [],
			rating: null,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.user) {
			const address = this.buildUsualAddress();
			this.setState({
				usualAddressOptions: address,
			});
		}
	}

	buildUsualAddress() {
		if (Meteor.user().profile.addressBook === undefined) {
			return {
				address: [],
				city: "San Jose",
			};
		}
		return Meteor.user().profile.addressBook.map((value) => {
			const address = value.address + ", " + value.city + ", "
				+ value.province + " " + value.postcode + ", " + value.country;
			const city = value.city;
			return {
				address: address,
				city: city,
			};
		});
	}

	handleSearch(event) {
		event.preventDefault();
		if (this.state.find !== "" && this.state.near !== "") {
			this.props.history.push("/search", {
				option: this.state.searchOption,
				find: this.state.find,
				near: this.state.near,
			});
		}
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
		if (Meteor.user()) {
			const address = this.buildUsualAddress();
			this.setState({
				usualAddressOptions: address,
			});
		}
	}

	getCurrentLocation() {
		navigator.geolocation.getCurrentPosition((position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			Meteor.call("chefs.getAddress", latitude, longitude, (error, result) => {
				if (result !== undefined && result !== null) {
					const recommendAddress = result.features.map(value => value.place_name);
					this.setState({
						recommendAddressOptions: recommendAddress,
					});
				}
			});
			Meteor.call("chefs.getNearChefByGeo", latitude, longitude, (error, result) => {
				if (result !== undefined && result !== null) {
					const chefIds = result.chefs.map((value) => {
						return value.chef_id;
					});
					Meteor.call("chefComments.getRating", chefIds, (innerError, innerResult) => {
						if (innerResult !== undefined && innerResult !== null) {
							const rating = new Map();
							innerResult.forEach((value) => {
								rating.set(value._id, (value.totalRating / value.count).toFixed(2));
							});
							this.setState({
								currentCity: result.city,
								nearBusiness: result.chefs,
								rating: rating,
							});
						}
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
						<Button className={"homepage-menu-button"} onClick={() => {Meteor.logout(() => {this.forceUpdate();});}}>Logout</Button>
					</Menu.Item>
					<Menu.Item>
						<Link className={"homepage-menu-button-wrapper"} to={"/mypage"}><Button className={"homepage-menu-button"} color={"blue"}>User Page</Button></Link>
					</Menu.Item>
					{Meteor.user().profile.is_chef ?
						<Menu.Item>
							<Link className={"homepage-menu-button-wrapper"} to={"/chefinfo/"}><Button className={"homepage-menu-button"} color={"blue"}>Chef Page</Button></Link>
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
					<img className={"search-input-button-image"} src={"/images/search.svg"} alt={"search button"} />
				</button>
			</div>
		);
	}

	handleClickRecommendAddress(index) {
		const address = this.state.recommendAddressOptions[index];
		this.setState({
			recommendAddressOptions: [],
			usualAddressOptions: [],
			near: address,
		});
	}

	handleClickUsualAddress(index) {
		const address = this.state.usualAddressOptions[index];
		// TODO: 是否需要更新city信息，以及是否更新推荐信息
		this.setState( {
			recommendAddressOptions: [],
			usualAddressOptions: [],
			near: address.address,
		});
	}

	renderAddressOptions() {
		if ((this.state.recommendAddressOptions.length > 0 || this.state.usualAddressOptions.length > 0)
			&& this.state.near === "") {
			return (
				<div className={"address-options-wrapper"}>
					<div className={"address-options-placeholder"}>{""}</div>
					<div className={"address-options-list"}>
						{this.renderUsualAddressOptions()}
						{this.renderRecommendAddressOptions()}
					</div>
				</div>
			);
		} else {
			return "";
		}
	}

	renderUsualAddressOptions() {
		if (this.state.usualAddressOptions.length > 0) {
			return (
				<div>
					<div className={"address-options-tip"}>
						Your commonly used address
					</div>
					{this.state.usualAddressOptions.map((value, index) => {
						return (
							<div className={"address-options-item"} key={index} onClick={() => this.handleClickUsualAddress(index)}>
								{value.address}
							</div>
						);
					})}
				</div>
			);
		} else {
			return "";
		}
	}

	renderRecommendAddressOptions() {
		if (this.state.recommendAddressOptions.length > 0) {
			return (
				<div>
					<div className={"address-options-tip"}>
						Recommended address based on current location
					</div>
					{this.state.recommendAddressOptions.map((value, index) => {
						return (
							<div className={"address-options-item"} key={index} onClick={() => this.handleClickRecommendAddress(index)}>
								{value}
							</div>
						);
					})}
				</div>
			);
		} else {
			return "";
		}
	}

	renderNearBusiness() {
		return (
			this.state.nearBusiness.map((value) => {
				const rating = this.state.rating.get(value._id);
				let pictureUrl = "";
				if (!value.picture) {
					pictureUrl = "https://st2.depositphotos.com/4908849/9632/v/950/depositphotos_96323190-stock-illustration-italian-chef-vector.jpg";
				} else {
					pictureUrl = value.picture;
				}
				return (
					<Card key={value._id}>
						<CroppedImage
							url={pictureUrl}
							height={"200px"}
							alt={"chef picture"}
							onClick={() => {this.props.history.push(/chef/ + value._id);}}/>
						<Card.Content>
							<Card.Header>
								<Link to={/chef/ + value._id}>{value.name}</Link>
							</Card.Header>
							<Card.Meta>
								<div>
									Address: {value.address}
								</div>
								<div>
									Contact: {value.phone}
								</div>
							</Card.Meta>
							<Card.Description>
								{value.description}
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							Rating: {(rating === undefined || rating === null ? "0.00" : rating) + "/5.00"}
						</Card.Content>
					</Card>
				);
			})
		);
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
								<Grid.Column className={"recommendation-title"} textAlign={"center"} width={"16"}>
									<h2>Popular & New Business{this.state.currentCity !== "" ? " In " + this.state.currentCity : " Around You"}</h2>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={"16"}>
									<Card.Group itemsPerRow={3}>
										{this.renderNearBusiness()}
									</Card.Group>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
				</div>
			</div>
		);
	}
}

Homepage.propTypes = {
	history: PropTypes.object,
	user: PropTypes.object,
};

export default withTracker(() => {
	return {
		user: Meteor.user(),
	};
})(Homepage);