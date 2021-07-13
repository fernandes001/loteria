import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../locales/context';

import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';
import Jackpots from '../Jackpots/Jackpots';

import './Lotteries.css';

class Lotteries extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
				<BreadCrumbs titulo={language.page_lotteries} home="/"/>

				<Jackpots limit="100"/>
			</React.Fragment>
		);
	}
}

Lotteries.contextType = LanguageContext;

export default Lotteries;