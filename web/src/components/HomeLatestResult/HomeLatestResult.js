import React, { Component } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import gConf from '../../config/global.json';

import './HomeLatestResult.css';

class HomeLatestResult extends Component {
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
		await axios.get(gConf.apiHost+'/lotteries/public?page=1&limit=6&search=&result=true').then(res => {
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
			<tr key={lotteries.id}>
                <td>{lotteries.title}</td>
                <td className="text-center">{lotteries.lottery_day}</td>
                <td>
                	{JSON.parse(lotteries.result).numbers.map((numbers) =>
                		<button className="lottery-HomeLatestResult-circle" key={lotteries.id+numbers}>{numbers}</button>
                	)}
                </td>
            </tr>
		);

		return(
			<React.Fragment>
				{/* /secton */}
		        <section className="lottery-HomeLatestResult">
		            {/* /container */}
		            <div className="container">
		                {/* /row */}
		                <div className="row">
		                   {/* /col */}
		                    <div className="col-md-12">
		                        <h1 className="lottery-HomeLatestResult-title text-center">{language.home_latest_title}</h1>
		                    </div>{/* ./col */}

		                    <div className="col-md-2"></div>
		                    <div className="col-md-8">
		                        <p className="lottery-HomeLatestResult-description text-center">
		                            {language.home_latest_description}
		                        </p>
		                    </div>
		                    <div className="col-md-2"></div>
		                </div>{/* ./row */}

		                {/* /row */}
		                <div className="lottery-HomeLatestResult-box-group row">
		                    {/* /col */}
		                    <div className="col-md-8">
		                        <div className="lottery-HomeLatestResult-box-list lottery-HomeLatestResult-trophy">
		                            <h4 className="lottery-HomeLatestResult-sub-title">{language.home_latest_subtitle}</h4>
		                            <table>
		                                <thead>
		                                    <tr>
		                                        <th>{language.home_latest_lottery}</th>
		                                        <th className="text-center">{language.home_latest_draw_date}</th>
		                                        <th>{language.home_latest_numbers}</th>
		                                    </tr>
		                                </thead>

		                                <tbody>
		                                    {lotteriesList}
		                                </tbody>
		                            </table>
		                        </div>
		                    </div>{/* ./col */}

		                    {/* /col */}
		                    <div className="col-md-4">
		                        <div className="lottery-HomeLatestResult-box-list">

		                        </div>
		                    </div>{/* ./col */}
		                </div>{/* ./row */}

		                <div className="row">
		                    <div className="lottery-HomeLatestResult-all-results col-md-12 text-center"><Link to="/results">{language.home_latest_allresults}</Link></div>
		                </div>
		            </div>{/* ./container */}
		        </section>{/* ./section */}
			</React.Fragment>
		);
	}
}

HomeLatestResult.contextType = LanguageContext;

export default HomeLatestResult;