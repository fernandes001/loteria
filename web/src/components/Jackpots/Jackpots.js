import React, { Component } from 'react';

import axios from 'axios';

import {LanguageContext} from '../../locales/context';

import gConf from '../../config/global.json';

import './Jackpots.css';
import btcLogo from './images/btc_64_64.png';

class Jackpots extends Component {
	constructor(){
		super();
		this.state = {
			'lotteriesList' : [],
			'lotteriesListPages' : []
		};

		this.getOpenLottery = this.getOpenLottery.bind(this);
	}

	componentDidMount(){
		this.getOpenLottery();
	}

	async getOpenLottery(){
		await axios.get(gConf.apiHost+'/lotteries/public?page=1&limit='+this.props.limit+'&result=false&deleted=false&blocked=false&search=').then(res => {
			if(res.data.msgType === 2){
				this.setState({
					'lotteriesList' : res.data.data[0],
					'lotteriesListPages' : res.data.data[1]
				});
			}
		});
	}

	render(){
		let language = this.context;

		let lotteriesList = this.state.lotteriesList.map((lotteries) => 	
			<React.Fragment key={lotteries.id}>
				{/* /col */}
	            <div className="col-md-4 lottery-Jackpots-box">
	                <div className="lottery-Jackpots-sub-box">
	                	<div className="text-center pt-4"><img src={btcLogo} alt=''/></div>
	                	
	                	<div className="lottery-Jackpots-price">
	                		<i className="fab fa-btc"></i> {lotteries.default_prize > lotteries.lottery_sum ? (lotteries.default_prize / 1e8).toFixed(8) : (lotteries.lottery_sum / 1e8).toFixed(8)}
	                	</div>

	                	<div className="lottery-Jackpots-lottery">
	                		{lotteries.title}
	                	</div>

	                	<div className="lottery-Jackpots-lottery-draw">
	                		{lotteries.lottery_day}
	                	</div>

	                	<div className="lottery-Jackpots-bt">
	                		<a href='/' className="lottery-Jackpots-bt-rounded lottery-bg-blue">{language.jackpots_play}</a>
	                	</div>
	                </div>
	            </div>{/* ./col */}
            </React.Fragment>
		);

		return(
			<React.Fragment>
				{/* /section */}
		        <section className="lottery-Jackpots">
		            
		            {/* /container */}
		            <div className="container">

		                {/* /row */}
		                <div className="row">
		                    {lotteriesList}
		                </div>{/* ./row */}

		            </div>{/* ./container */}

		        </section>{/* ./section */}
			</React.Fragment>
		);
	}
}

Jackpots.contextType = LanguageContext;

export default Jackpots;