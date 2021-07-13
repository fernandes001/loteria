import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './HomeNextLottery.css';

class HomeNextLottery extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		let language = this.context;
		return(
			<React.Fragment>
				{/* /section */}
		        <section className="lottery-HomeNextLottery">

		            {/* /container */}
		            <div className="container">

		                {/* /row */}
		                <div className="lottery-HomeNextLottery-padding row">
		                
		                    {/* /col */}
		                    <div className="col-md-4">
		                        <h3 className="lottery-HomeNextLottery-title">
		                            {language.home_next_title}
		                        </h3>

		                        <p className="lottery-HomeNextLottery-description">
		                            {language.home_next_description} <Link to="/results">{language.home_next_results}</Link>
		                        </p>
		                    </div>{/* ./col */}

		                    {/* /col */}
		                    <div className="col-md-5">
		                        <div className="lottery-HomeNextLottery-circles-box text-center">
		                            <div className="d-inline-block pr-2 pl-2">
		                                <div className="lottery-HomeNextLottery-circle">
		                                    <div className="lottery-HomeNextLottery-line-divider"></div>
		                                    <span>0</span>
		                                </div>
		                                <div>Dias</div>
		                            </div>

		                            <div className="d-inline-block pr-2 pl-2">
		                                <div className="lottery-HomeNextLottery-circle">
		                                    <div className="lottery-HomeNextLottery-line-divider"></div>
		                                    <span>0</span>
		                                </div>
		                                <div>hrs</div>
		                            </div>

		                            <div className="d-inline-block pr-2 pl-2">
		                                <div className="lottery-HomeNextLottery-circle">
		                                    <div className="lottery-HomeNextLottery-line-divider"></div>
		                                    <span>0</span>
		                                </div>
		                                <div>mins</div>
		                            </div>

		                            <div className="d-inline-block pr-2 pl-2">
		                                <div className="lottery-HomeNextLottery-circle">
		                                    <div className="lottery-HomeNextLottery-line-divider"></div>
		                                    <span>0</span>
		                                </div>
		                                <div>sec</div>
		                            </div>
		                        </div>
		                    </div>{/* ./col */}

		                    {/* /col */}
		                    <div className="col-md-3">
								<Link to="/account/create" className="lottery-HomeNextLottery-button-box lottery-bt-rounded lottery-bg-none">{language.home_next_buy}</Link>
		                    </div>{/* ./col */}

		                </div>{/* ./row */}

		            </div>{/* ./container */}

		        </section>{/* ./section */}
	        </React.Fragment>
		);
	}
}

HomeNextLottery.contextType = LanguageContext;

export default HomeNextLottery;