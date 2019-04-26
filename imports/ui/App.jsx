import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Recipe from "./pages/Recipe.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MyPage from "./pages/MyPage.jsx";
import ChefPage from "./pages/ChefPage.jsx";
import ChefInfo from "./pages/ChefInfo.jsx";
import SearchPage from "./pages/SearchPage";
import ChefSignUp from "./pages/ChefSignUp";

const App = () => (
	<div>
		<Router>
			<Route exact path="/" component={Homepage} />
			<Route path={"/search"} component={SearchPage}/>
			<Route exact path={"/chef/:chefId"} component={ChefPage} />
			<Route exact path="/recipe/:recipeId" component={Recipe} />
			<Route exact path="/login" component = {Login} />
			<Route exact path="/signup" component = {Signup} />
			<Route exact path="/mypage" component = {MyPage} />
			<Route exact path="/chefinfo" component = {ChefInfo} />
			<Route exact path="/chef-signup" component = {ChefSignUp} />
		</Router>
	</div>
);

export default App;
