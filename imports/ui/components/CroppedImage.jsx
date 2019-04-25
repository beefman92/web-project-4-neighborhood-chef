import React, { Component } from "react";
import PropTypes from "prop-types";

import "../style/homepage.css";

export default class CroppedImage extends Component {
	constructor(props) {
		super(props);
		this.handleImageOnClick = this.handleImageOnClick.bind(this);
		this.isClickable = this.props.onClick !== undefined && this.props.onClick !== null;
	}

	handleImageOnClick(event) {
		if (this.props.onClick !== undefined && this.props.onClick !== null) {
			this.props.onClick(event);
		}
	}

	render() {
		const imgClassName = this.isClickable ? "clickable-cropped-image" : "cropped-image";
		return (
			<div
				className={"cropped-image-wrapper"}
				style={{height: this.props.height}}>
				<img className={imgClassName} src={this.props.url} alt={this.props.alt} onClick={this.handleImageOnClick}/>
			</div>
		);
	}
}

CroppedImage.propTypes = {
	url: PropTypes.string.isRequired,
	height: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};
