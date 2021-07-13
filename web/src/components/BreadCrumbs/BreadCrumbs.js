import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './BreadCrumbs.css';

class BreadCrumbs extends Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
	            {this.props.type === 'compact' ? (
	            	<section className="lottery-BreadCrumbs">
		            	<div className="lottery-BreadCrumbs-breadcrumbs">
	                        <ul>
	                            <li><Link to={this.props.home}>{language.page_home}</Link> <i className="fas fa-angle-right ml-1 mr-1"></i></li>
	                            <li>{this.props.titulo}</li>
	                        </ul>
	                    </div>
                    </section>
	            ) : (
	            	<section className="lottery-BreadCrumbs lottery-BreadCrumbs-line">
						<div className="container">
			                <div className="row">
			                    <div className="lottery-BreadCrumbs-breadcrumbs col-md-12">
			                        <ul>
			                            <li><Link to={this.props.home}>{language.page_home}</Link> <i className="fas fa-angle-right ml-1 mr-1"></i></li>
			                            <li>{this.props.titulo}</li>
			                        </ul>
			                    </div>
			                </div>
			            </div>
		            </section>
	            )}
			</React.Fragment>
		);
	}
}

BreadCrumbs.contextType = LanguageContext;

export default BreadCrumbs;