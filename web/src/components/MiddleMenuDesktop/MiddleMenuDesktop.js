import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './MiddleMenuDesktop.css';
import logo from './images/logo.png';

class MiddleMenuDesktop extends Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
		
	}

	render(){
		let language = this.context;
		return (
			<React.Fragment>
				{/* <!-- /section --> */}
		        <section className="lottery-MiddleMenuDesktop">
		            {/* <!-- /container --> */}
		            <div className="container">
		                {/* <!-- /row --> */}
		                <div className="row">
		                    <div className="col-3">
		                        <img src={logo} alt=""/>
		                    </div>

		                    <div className="col-7">
		                        <div className="lottery-MiddleMenuDesktop-links">
		                        	<ul>
		                                <li><Link to="/">{language.menu_home}</Link></li>
		                                <li><Link to="/results">{language.menu_results}</Link></li>
		                                <li><Link to="/lotteries">{language.menu_lotteries}</Link></li>
		                                <li><Link to="/contact">{language.menu_contact}</Link></li>
		                                {/*<li><Link to="#">Mais <i className="fas fa-angle-down"></i></Link></li>*/}
		                            </ul>
		                        </div>
		                    </div>
		                    
		                    <div className="col-2">
		                        <Link to="/account/create" className="lottery-MiddleMenuDesktop-account lottery-bt-rounded lottery-bg-blue">{language.menu_account}</Link>
		                    </div>
		                </div>{/* <!-- ./row --> */}
		            </div>{/* <!-- ./container --> */}
		        </section>{/* <!-- ./section --> */}
	        </React.Fragment>
		);
	}
}

MiddleMenuDesktop.contextType = LanguageContext;

export default MiddleMenuDesktop;