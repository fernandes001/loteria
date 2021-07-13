import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './HomeBanner.css';

class HomeBanner extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		let language = this.context;
		return(
			<React.Fragment>
				{/* <!-- /section --> */}
		        <section className="lottery-HomeBanner">
		            {/* <!-- /container --> */}
		            <div className="lottery-HomeBanner-bg container">
		                {/* <!-- /row --> */}
		                <div className="row">
		                    <div className="col-md-12">
		                        <p className="lottery-HomeBanner-title">
		                            {language.home_banner_title}
		                        </p>

		                        <p className="lottery-HomeBanner-description">
		                            {language.home_banner_description}
		                        </p>

		                        <Link to="/account/login" className="lottery-HomeBanner-buy lottery-bt-rounded lottery-bg-blue">{language.home_banner_buy}</Link>
		                    </div>
		                </div>{/* <!-- ./row --> */}
		            </div>{/* <!-- ./container --> */}
		        </section>{/* <!-- ./section --> */}
			</React.Fragment>
		);
	}
}

HomeBanner.contextType = LanguageContext;

export default HomeBanner;