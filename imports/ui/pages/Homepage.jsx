import React, { Component } from "react";
import ReactMapGL, { NavigationControl, Marker} from "react-map-gl";

export default class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewport: {
				width: 600,
				height: 600,
				latitude: 37.7577,
				longitude: -122.4376,
				zoom: 15
			}
		};
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition((position) => {
			const newViewport = Object.assign({}, this.state.viewport);
			newViewport.latitude = position.coords.latitude;
			newViewport.longitude = position.coords.longitude;
			this.setState({viewport: newViewport});
		});
	}

	handleOnViewportChange(viewport) {
		this.setState({viewport: viewport});
	}

	render() {
		return (
			<div>Hello World!</div>

		);
	}
}