import React, { Component } from 'react';

import HomeBanner from '../HomeBanner/HomeBanner';
import HomeNextLottery from '../HomeNextLottery/HomeNextLottery';
import Jackpots from '../Jackpots/Jackpots';
import HomeLatestResult from '../HomeLatestResult/HomeLatestResult';

class Home extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		return(
			<React.Fragment>
	            <HomeBanner />

	            <HomeNextLottery />

	            <div className="lottery-separator-top"></div>

	            <Jackpots limit="3"/>

	            <HomeLatestResult />
            </React.Fragment>
		);
	}
}

export default Home;