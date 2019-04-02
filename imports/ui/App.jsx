import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Recipe from "./pages/Recipe.jsx";

const App = () => (
	<div>
		<Router>
			<Route exact path="/" component={Homepage} />
			<Route exact path="/recipe/:id" component={Recipe} />
		</Router>
	</div>
);

export default App;
