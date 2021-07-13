import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import './TopMenu.css';

class TopMenu extends Component {
	constructor(){
		super();
		let lang = localStorage.getItem('language_selected') !== null ? localStorage.getItem('language_selected') : 'PT';
		this.state = {
			'open_language' : false,
			'language_selected' : lang
		};

		this.openLanguage = this.openLanguage.bind(this);
		this.selectLanguage = this.selectLanguage.bind(this);
	}

	openLanguage(){
		let open_language = this.state.open_language;

		this.setState({
			'open_language' : open_language === false ? true : false
		});
	}

	selectLanguage(event){
		let language = event.target.value;
		this.props.back(language);

		localStorage.setItem('language_selected', language);

		this.setState({
			'language_selected' : language
		});
	}

	render(){
		let language = this.context;
		return(
			<React.Fragment>
				{/* /section */}
		        <section className="lottery-TopMenu">
		            {/* /container */}
		            <div className="container">
		                <div className="row">
		                    <div className="lottery-TopMenu-language-box col-6">
		                        <div className="lottery-TopMenu-language mr-3" onClick={this.openLanguage}>
		                            <i className="fas fa-globe lottery-color-blue"></i> <span>{this.state.language_selected}</span> <i className="fas fa-angle-down"></i>
		                            <ul className={this.state.open_language === false ? 'lottery-TopMenu-language-off' : 'shadow-sm lottery-TopMenu-language-on'}>
		                                <li><button type="button" value="PT" onClick={this.selectLanguage}>PT</button></li>
		                                <li><button type="button" value="EN" onClick={this.selectLanguage}>EN</button></li>
		                            </ul>
		                        </div>
		                    </div>

		                    <div className="lottery-TopMenu-chart-box col-6 text-right">
		                        <div className="d-inline-block">
		                            <i className="fas fa-shopping-cart lottery-color-white"></i>
		                        </div> 
		                        <span className="d-inline-block"><Link to="#">{language.top_alerts} (0)</Link></span>
		                    </div>
		                </div>
		            </div>{/* ./container */}
		        </section>{/* ./section */}
	        </React.Fragment>
		);
	}
}

TopMenu.contextType = LanguageContext;

export default TopMenu;