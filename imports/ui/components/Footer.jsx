import React, { Component } from "react";
import {Grid, Container} from "semantic-ui-react";

import "../style/footer.css";

export default class Footer extends Component {
	render() {
		return (
			<Grid className={"footer-wrapper"}>
				<Container>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<div>
								&copy; {new Date().getFullYear()} Copyright: Yibo and Fang&#39;s Project 2019
							</div>
							<div>
								Contact information: <a href="mailto:ergou.wang@outlook.com">Yibo</a> or <a href="mailto:summerhong1@gmail.com">Fang</a>
							</div>
							<div>
								Address: 6024 Silver Creek Valley Rd, San Jose, CA 95138
							</div>
						</Grid.Column>
					</Grid.Row>
				</Container>
			</Grid>
		);
	}
}