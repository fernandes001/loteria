import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './Footer.css';
import logo from './images/logo.png';

class Footer extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		let language = this.context;
		return(
			<React.Fragment>
				{/* <!-- /footer --> */}
		        <footer className="lottery-Footer">
		            {/* <!-- /container --> */}
		            <div className="container">
		                {/* <!-- /row --> */}
		                <div className="row">
		                    {/* <!-- /col --> */}
		                    <div className="col-md-6">
		                        {/* <!-- /row --> */}
		                        <div className="lottery-Footer-h-box-1 row">
		                            {/* <!-- /col --> */}
		                            <div className="col-md-12">
		                                <img src={logo} alt=""/>
		                            </div>{/* <!-- ./col --> */}
		                        </div>{/* <!-- ./row --> */}

		                        {/* <!-- /row --> */}
		                        <div className="row lottery-Footer-h-box-2">
		                            {/* <!-- /col --> */}
		                            <div className="col-6">
		                                <h6 className="lottery-Footer-title">
		                                    {language.footer_about_us}
		                                </h6>

		                                <div className="lottery-Footer-links">
		                                    <ul>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="#">{language.footer_about_us}</Link></li>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="#">{language.footer_how_it_works}</Link></li>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="/contact">{language.footer_contact}</Link></li>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="#">{language.footer_faq}</Link></li>
		                                    </ul>
		                                </div>
		                            </div>{/* <!-- ./col --> */}

		                            {/* <!-- /col --> */}
		                            <div className="col-6">
		                                <h6 className="lottery-Footer-title">
		                                    {language.footer_links}
		                                </h6>

		                                <div className="lottery-Footer-links">
		                                    <ul>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="/account/login">{language.footer_account}</Link></li>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="#">{language.footer_terms}</Link></li>
		                                        <li><i className="fas fa-angle-right mr-2"></i><Link to="#">{language.footer_privacy}</Link></li>
		                                    </ul>
		                                </div>
		                            </div>{/* <!-- ./col --> */}
		                        </div>{/* <!-- ./row --> */}
		                    </div>{/* <!-- ./col --> */}

		                    {/* <!-- /col --> */}
		                    <div className="col-md-6">
		                        {/* <!-- /row --> */}
		                        <div className="lottery-Footer-h-box-1 row">
		                            <div className="col-md-4 col-6">
		                                <div className="lottery-Footer-counter">
		                                    0
		                                </div>      

		                                <div className="mt-2">
		                                    {language.footer_users}    
		                                </div>                          
		                            </div>
		                            <div className="col-md-4 col-6">
		                                <div className="lottery-Footer-counter">
		                                    0
		                                </div>
		                                <div className="mt-2">
		                                    {language.footer_tickets}
		                                </div>               
		                            </div>
		                        </div>{/* <!-- ./row --> */}

		                        {/* <!-- /row --> */}
		                        <div className="lottery-Footer-h-box-2 row">
		                            <div className="col-md-12">
		                                <h6 className="lottery-Footer-title">
		                                    {language.footer_newsletter}
		                                </h6>

		                                <p className="lottery-Footer-description">
		                                    {language.footer_newsletter_description}
		                                </p>

		                                <div className="lottery-Footer-newsletter mt-3">
		                                    <div className="input-group">
		                                        <input type="text" className="form-control" placeholder={language.placeholder_email} name="newsletter"/>
		                                        <div className="input-group-append">
		                                            <button id="btNewsletter">{language.footer_newsletter_subscribe}</button>
		                                        </div>
		                                    </div>
		                                </div>
		                            </div>
		                        </div>{/* <!-- ./row --> */}
		                    </div>{/* <!-- ./col --> */}
		                </div>{/* <!-- ./row --> */}
		            </div>{/* <!-- ./container --> */}
		        </footer>{/* <!-- ./footer --> */}
			</React.Fragment>
		);
	}
}


Footer.contextType = LanguageContext;

export default Footer;