import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';

import './Contact.css';

class Contact extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
				<BreadCrumbs titulo={language.page_contact} home="/"/>

				{/* /section */}
		        <section className="lottery-Contact" home="/">
		            
		            {/* /container */}
		            <div className="container">

		                {/* /row */}
		                <div className="row justify-content-center">
		                	
		                	{/* /col */}
		                    <div className="col-md-10">
		                    	<div className="lottery-Contact-box-contact">
		                    		{/* /container */}
		                    		<div className="container">
			                    		{/* /row */}
			                    		<div className="row">
			                    			<div className="col-md-6 lottery-Contact-white-box">
			                    				<form>
				                    				<div className="form-group">	
											      		<label htmlFor="name">{language.label_name}</label>
												    	<input type="text" className="form-control" name="name" id="name" placeholder={language.placeholder_name} />

											      		<label className="pt-2" htmlFor="email">{language.label_email}</label>
												    	<input type="text" className="form-control" name="email" id="email" placeholder={language.placeholder_email} />
												    
												    	<label className="pt-2" htmlFor="bodymessage">{language.label_message}</label>
	    												<textarea className="form-control" id="bodymessage" name="bodymessage" rows="6"></textarea>
												    </div>

												    <div className="text-right">
												    	<button type="submit" className="lottery-bt-rounded lottery-bg-blue" name="btncontact" id="btncontact">{language.bt_send}</button>
												    </div>
											    </form>
			                    			</div>

			                    			<div className="col-md-6 lottery-Contact-black-box">
			                    				Empty
			                    				<hr/>
			                    			</div>
			                    		</div>{/* ./row */}
		                    		</div>{/* ./container */}
		                    	</div>
		                    </div>{/* ./col */}
		                    
		                </div>{/* ./row */}

		            </div>{/* ./container */}

		        </section>{/* ./section */}
			</React.Fragment>
		);
	}
}

Contact.contextType = LanguageContext;

export default Contact;