import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Button } from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

import "../style/shopping-cart.css";
import { ShoppingCarts } from "../../api/shopping-carts";

class ShoppingCart extends Component {
	constructor(props) {
		super(props);
		this.hidden = true;
		this.state = {
			mouseOver: -1,
		};
	}

	handleOnClick() {
		if (this.hidden) {
			this.hidden = false;
			document.getElementById("shoppingCartDiv").style.right = "300px";
			document.getElementById("shoppingCart").style.right = "0px";
		} else {
			this.hidden = true;
			document.getElementById("shoppingCartDiv").style.right = "0px";
			document.getElementById("shoppingCart").style.right = "-300px";
		}
	}

	handleClose() {
		this.hidden = true;
		document.getElementById("shoppingCartDiv").style.right = "0px";
		document.getElementById("shoppingCart").style.right = "-300px";
	}

	handleOnMouseOver(index) {
		this.setState({
			mouseOver: index,
		});
	}

	handleOnMouseOut() {
		this.setState({
			mouseOver: -1,
		});
	}

	handlePlusOrMinusClick(mark, id, recipeId, event) {
		// TODO: modify data
		event.preventDefault();
		if (mark === "+") {
			Meteor.call("shoppingCarts.plusOne", recipeId);
		} else if (mark === "-") {
			Meteor.call("shoppingCarts.minusOne", recipeId);
		}
	}

	render() {
		return (
			<div>
				<div id={"shoppingCartDiv"} onClick={() => this.handleOnClick()}>
					<img id={"shoppingCartIcon"} src="/images/shopping-cart.png" alt="shopping cart"/>
				</div>
				<div id={"shoppingCart"}>
					<button type="button" className="close" onClick={() => this.handleClose()}>
						<span aria-hidden="true">×</span>
						<span className="sr-only">Close</span>
					</button>
					<div id={"shoppingCartTitle"}><h4>Shopping List</h4></div>
					<hr/>
					<div id={"shoppingCartItemsList"}>
						{
							this.props.items.map((item, index) => {
								const className = this.state.mouseOver === index ?
									"plus-minus-mark" : "plus-minus-mark-hidden";
								return (
									<div key={item._id} className={"shopping-cart-item"}>
										<div className={"shopping-cart-item-info"}>{item.name}</div>
										<div className={"shopping-cart-item-count"}
											onMouseOver={() => this.handleOnMouseOver(index)}
											onMouseOut={() => this.handleOnMouseOut()}>
											<span className={className}
												onClick={(e) => this.handlePlusOrMinusClick("+", item._id, item.recipe_id, e)}> + </span>
											<span className={"count"}>{item.count}</span>
											<span className={className}
												onClick={(e) => this.handlePlusOrMinusClick("-", item._id, item.recipe_id, e)}> - </span>
										</div>
										<div className={"shopping-cart-item-price"}>$ {item.count * item.unit_price}</div>
									</div>
								);
							})
						}
					</div>
					<hr/>
					<div id={"shoppingCartFooter"}>
						<div className={"shopping-cart-left-box"}>
							<div style={{textAlign: "left", width: "100%", marginLeft: "10%"}}>
								Price: 0 $
							</div>
						</div>
						<div className={"shopping-cart-right-box"}>
							<div style={{textAlign: "right", width: "100%", marginRight: "10%"}}>
								<Button variant={"success"}>Check</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ShoppingCart.propTypes = {
	items: PropTypes.array,
};

export default withTracker(() => {
	Meteor.subscribe("userShoppingCarts");
	return {
		items: ShoppingCarts.find({user_id: Meteor.userId()}).fetch(),
	};
})(ShoppingCart);