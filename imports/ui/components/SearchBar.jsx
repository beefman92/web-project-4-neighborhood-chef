import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";

import "../style/search-bar.css";

export const OPTION_FOOD = 0;
export const OPTION_CHEF = 1;

export default class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchOption: OPTION_FOOD,
			find: "",
			near: "",
		};
	}

	handleSubmit(event) {
		const data = {
			option: this.state.searchOption,
			find: this.state.find,
			near: this.state.near,
		};
		this.props.onSubmit(event, data);
	}

	handleInputOnChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
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

	render() {
		let findPlaceholder = "";
		if (this.state.searchOption === OPTION_FOOD) {
			findPlaceholder = "Burgers, noodles, tacos...";
		} else if (this.state.searchOption === OPTION_CHEF) {
			findPlaceholder = "Chef xxx is popular...";
		}
		const nearPlaceholder = "Pick or enter your address";
		const foodClassName = "search-input-option" + (this.state.searchOption === OPTION_FOOD ? " search-input-option-active" : "");
		const chefClassName = "search-input-option" + (this.state.searchOption === OPTION_CHEF ? " search-input-option-active" : "");
		return (
			<Grid.Row>
				<Grid.Column width={"5"}>
					<div style={{height: "100px"}}>
						<div className={"search-bar-trademark-title"}>
							<h1>NeighborChef</h1>
						</div>
						<img className={"search-bar-trademark-icon"} src="/images/chef-hat.svg" alt="website trademark"/>
					</div>
				</Grid.Column>
				<Grid.Column width={"11"}>
					<div className={"search-input-item-wrapper"}>
						<div className={foodClassName} onClick={() => this.handleClickOption(OPTION_FOOD)}>Food</div>
						<div className={chefClassName} onClick={() => this.handleClickOption(OPTION_CHEF)}>Chef</div>
					</div>
					<div className={"search-input-wrapper"}>
						<label className={"search-input-label"}>
							<span className={"search-input-label-content"}>Find</span>
							<input
								className={"search-input"}
								placeholder={findPlaceholder}
								name={"find"}
								value={this.state.find}
								type="text"
								onChange={(e) => this.handleInputOnChange(e)}/>
						</label>
						<label className={"search-input-label"}>
							<span className={"search-input-label-content"}>Near</span>
							<input
								className={"search-input"}
								placeholder={nearPlaceholder}
								name={"near"}
								value={this.state.near}
								type="text"
								onChange={(e) => this.handleInputOnChange(e)}/>
						</label>
						<button className={"search-input-button"} onClick={(e) => this.handleSubmit(e)}>
							<img className={"search-input-button-image"} src={"/images/search.svg"} alt={"search button"}/>
						</button>
					</div>
				</Grid.Column>
			</Grid.Row>
		);
	}
}

SearchBar.propTypes = {
	onSubmit: PropTypes.func.isRequired,
};