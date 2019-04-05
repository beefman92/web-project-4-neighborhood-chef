import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Recipe from "./pages/Recipe.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
<<<<<<< HEAD
import MyPage from "./pages/MyPage.jsx";
=======
import ChefPage from "./pages/ChefPage.jsx";
>>>>>>> 5d070ae697b567f3498fe1e602ccb7bba41ff6b4

const App = () => (
	<div>
		<Router>
			<Route exact path="/" component={Homepage} />
			<Route exact path={"/chef/:chefId"} component={ChefPage} />
			<Route exact path="/recipe/:id" component={Recipe} />
			<Route exact path="/login" component = {Login} />
			<Route exact path="/signup" component = {Signup} />
			<Route exact path="/mypage" component = {MyPage} />

		</Router>
	</div>
);

export default App;
