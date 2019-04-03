import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Recipe from "./pages/Recipe.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

const App = () => (
	<div>
		<Router>
			<Route exact path="/" component={Homepage} />
			<Route exact path="/recipe/:id" component={Recipe} />
			<Route exact path="/login" component = {Login} />
			<Route exact path="/signup" component = {Signup} />

		</Router>
	</div>
);

export default App;
