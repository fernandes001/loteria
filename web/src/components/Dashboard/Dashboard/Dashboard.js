import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import DashboardUsersList from '../DashboardUsersList/DashboardUsersList';
import DashboardAccount from '../DashboardAccount/DashboardAccount';
import DashboardLotteriesList from '../DashboardLotteriesList/DashboardLotteriesList';
import DashboardTicketsList from '../DashboardTicketsList/DashboardTicketsList';
import DashboardDefault from '../DashboardDefault/DashboardDefault';
import DashboardDepositsList from '../DashboardDepositsList/DashboardDepositsList';
import DashboardWithdrawalList from '../DashboardWithdrawalList/DashboardWithdrawalList';

import './Dashboard.css';

class Dashboard extends Component{
	constructor(props){
		super(props);
		this.state = {
			'page' : this.props.match.params.page,
			'action' : this.props.match.params.action,
			'logged' : this.props.location.state !== undefined ? this.props.location.state.logged : false,
			'userId' : this.props.location.state !== undefined ? this.props.location.state.userId : null,
			'userLevel' : this.props.location.state !== undefined ? this.props.location.state.userLevel : null
		};
	}

	componentDidMount(){
		this._isMounted = true;
		// if I reload I reset logged state for don't permit reload in page
		this.props.history.push({
			state : {'logged' : false}
		});
	}

	componentWillUmount(){
		this._isMounted = false;
	}

	componentDidUpdate(prevProps){
		if(prevProps.match.params.page !== this.props.match.params.page){
			console.log("Dashboard-didUpdate: ", this.props.match);
		
			if(this._isMounted){
				this.setState({
					'page' : this.props.match.params.page			
				});
			}
		}
		if(prevProps.match.params.action !== this.props.match.params.action){
			console.log("Dashboard-didUpdate: ", this.props.match);
			
			if(this._isMounted){
				this.setState({
					'action' : this.props.match.params.action			
				});
			}
		}
	}

	render(){
		if(this.state.logged === false){
			return(
				<Redirect to="/account/login" />
			);
		}

		return(
			this.state.page === 'users' && this.state.action === undefined ?
				<DashboardUsersList userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
			:

			this.state.page === 'deposits' && this.state.action === undefined ?
    			<DashboardDepositsList userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
    		:

    		this.state.page === 'lotteries' && this.state.action === undefined ?
    			<DashboardLotteriesList userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
    		:

			this.state.page === 'tickets' && this.state.action === undefined ?
				<DashboardTicketsList userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
			:

			this.state.page === 'withdrawal' && this.state.action === undefined ?
				<DashboardWithdrawalList userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
			:

			this.state.page === 'account' && this.state.action === undefined ?
    			<DashboardAccount userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
    		:

    			<DashboardDefault userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page} />
		);
		
	}
}

export default Dashboard;