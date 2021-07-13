import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {LanguageContext} from '../../../locales/context';

import './DashboardMenu.css';

class DashboardMenu extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null
		};
	}

	componentDidMount(){
		
	}

	render(){
		let language = this.context;
		return(
			<React.Fragment>
				{/* /section */}
				<section className="lottery-DashboardMenu">
					{/* /container */}
					<div className="container">
						{/* /row */}
						<div className="row">
							{/* /col */}
							<div className="col-md-12">
								<ul>
									<li className={this.state.page === null ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard">{language.dashboard_menu_home}</Link></li>
									
									<li className={this.state.page === 'account' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/account">{language.dashboard_my_account}</Link></li>
									
									{this.state.userLevel === 2 ? (
										<li className={this.state.page === 'users' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/users">{language.dashboard_users}</Link></li>
									) : ''}
									
									<li className={this.state.page === 'tickets' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/tickets">{language.dashboard_tickets}</Link></li>
									
									{this.state.userLevel === 2 ? (
										<li className={this.state.page === 'lotteries' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/lotteries">{language.dashboard_lotteries}</Link></li>
									) : ''}
									
									<li className={this.state.page === 'deposits' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/deposits">{language.dashboard_deposits}</Link></li>
									
									<li className={this.state.page === 'withdrawal' ? 'lottery-DashboardMenu-checked' : ''}><Link to="/dashboard/withdrawal">{language.dashboard_withdrawal}</Link></li>
								</ul>
							</div>{/* ./col */}
						</div>{/* ./row */}
					</div>{/* ./container */}
				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

DashboardMenu.contextType = LanguageContext;

export default DashboardMenu;