import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Recipe from "./pages/Recipe.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MyPage from "./pages/MyPage.jsx";
import ChefPage from "./pages/ChefPage.jsx";
import ChefInfo from "./pages/ChefInfo.jsx";

const App = () => (
	<div>
		<Router>
			<Route exact path="/" component={Homepage} />
			<Route exact path={"/chef/:chefId"} component={ChefPage} />
			<Route exact path="/recipe/:id" component={Recipe} />
			<Route exact path="/login" component = {Login} />
			<Route exact path="/signup" component = {Signup} />
			<Route exact path="/mypage" component = {MyPage} />
			<Route exact path="/chefinfo" component = {ChefInfo} />

		</Router>
	</div>
);

export default App;
