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
			<Route exact path="/recipe/:recipeId" component={Recipe} />
			
			{/* I might suggest forwarding any already logged-in user to your homepage in case anyone goes direct to the /login or uses a back button */}
			<Route exact path="/login" component = {Login} />
			<Route exact path="/signup" component = {Signup} />
			
			{/* And I might make these redirect if not logged in to the login page - seems like mypage does sometimes but chefinfo never does */}
			<Route exact path="/mypage" component = {MyPage} />
			<Route exact path="/chefinfo" component = {ChefInfo} />

			{/* Here you may want to catch anything that is not the above and forward it home or direct to a page not found component */}
			{/* <Route component={NotFoundPage} /> */}
		</Router>
	</div>
);

export default App;
