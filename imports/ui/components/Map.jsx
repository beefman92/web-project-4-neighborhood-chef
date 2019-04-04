import React, { Component } from "react";
import ReactMapGL, { NavigationControl, Marker, FullscreenControl } from "react-map-gl";
import "../style/homepage.css";

const mapboxToken = "pk.eyJ1IjoiYmVlZm1hbiIsImEiOiJjanR6NnB6aHgxZG1qNDRvNmE2aHk1ZmxxIn0.GQfRdh2TgULozdcuuZdTUg";

export default class Map extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition((position) => {
			const newViewport = Object.assign({}, this.state.viewport);
			newViewport.latitude = position.coords.latitude;
			newViewport.longitude = position.coords.longitude;
			this.yourLocation.latitude = position.coords.latitude;
			this.yourLocation.longitude = position.coords.longitude;
			this.setState({viewport: newViewport});
		});
	}

	handleOnViewportChange(viewport) {
		this.setState({viewport: viewport});
	}

	render() {
		return (
			<ReactMapGL
				{...this.state.viewport}
				mapboxApiAccessToken={mapboxToken}
				transitionDuration={0}
				mapStyle={"mapbox://styles/mapbox/navigation-guidance-day-v4"}
				onViewportChange={(v) => this.handleOnViewportChange(v)}>
				<div style={{position: "absolute", top: 0, left: 0, padding: "10px"}}>
					<FullscreenControl />
				</div>
				<div style={{position: "absolute", top: 36, left: 0, padding: "10px"}}>
					<NavigationControl onViewportChange={(v) => this.handleOnViewportChange(v)} captureScroll={true} captureDrag={true}/>
				</div>
				<Marker latitude={this.yourLocation.latitude} longitude={this.yourLocation.longitude} offsetLeft={-20} offsetTop={-10}>
					<img className={"pin-picture"} src="/images/pin.png" alt=""/>
				</Marker>
			</ReactMapGL>
		);
	}
}