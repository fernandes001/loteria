import React, { Component } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';
import gConf from '../../config/global.json';

import './Results.css';
import btcLogo from './images/btc_48_48.png'

class Results extends Component {
	constructor(){
		super();
		this.state = {
			'lotteriesList' : [],
			'lotteriesListPages' : []
		};
	}

	componentDidMount(){
		this.getOpenLottery();
	}

	async getOpenLottery(){
		await axios.get(gConf.apiHost+'/lotteries/public?page=1&limit=100&search=&result=true').then(res => {
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
				<div className="row">
		        	<div className="col-md-1">
		        		<img src={btcLogo} alt=''/>
		        	</div>

		        	<div className="col-md-3">
		        		<span className="lottery-Results-box-title">{lotteries.title}</span>
		        	</div>

		        	<div className="col-md-2">
		        		<span className="lottery-Results-box-prize">
			        		<i className="fab fa-btc"></i> 
			        		{lotteries.default_prize > lotteries.lottery_sum ? (lotteries.default_prize / 1e8).toFixed(8) : (lotteries.lottery_sum / 1e8).toFixed(8)}
		        		</span>
		        		<span className="lottery-Results-box-date">{lotteries.lottery_day}</span>
		        	</div>

		        	<div className="col-md-6">
		        		{JSON.parse(lotteries.result).numbers.map((numbers) => 
		        			<button className="lottery-Results-circle" key={lotteries.id+numbers}>{numbers}</button>
		        		)}
		        	</div>
		        </div>
	        </React.Fragment>
		);

		return(
			<React.Fragment>
				<BreadCrumbs titulo={language.page_results} home="/"/>

				{/* /section */}
		        <section className="lottery-Results">
		            
		            {/* /container */}
		            <div className="container">

		                {/* /row */}
		                <div className="row">
		                	
		                	{/* /col */}
		                    <div className="col-md-12">
		                    	<div className="container lottery-Results-box">	
		                    		<div className="container">
		                        		{lotteriesList}
		                        	</div>
		                        </div>
		                    </div>{/* ./col */}
		                    
		                </div>{/* ./row */}

		            </div>{/* ./container */}

		        </section>{/* ./section */}
			</React.Fragment>
		);
	}
}

Results.contextType = LanguageContext;

export default Results;