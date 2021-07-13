import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';

import './DashboardUsersList.css';

class DashboardUsersList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,
			'search' : '',
			'deleted' : false,
			'blocked' : false,
			'usersList' : [],
			'usersListPages' : []
		};

		this.setSearch = this.setSearch.bind(this);
		this.setBlocked = this.setBlocked.bind(this);
		this.setDeleted = this.setDeleted.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.umblockUser = this.umblockUser.bind(this);
		this.blockUser = this.blockUser.bind(this);
	}

	componentDidMount(){
		this.getUsers();

		this.IntervalGetUsers = setInterval(() => {
			this.getUsers();
		}, 30000);
	}

	componentDidUpdate(prevProps, prevState){
		// check blocked prevState
		let blocked = this.state.blocked;
		if(prevState.blocked !== blocked){
			this.getUsers();
		}

		// check deleted prevState
		let deleted = this.state.deleted;
		if(prevState.deleted !== deleted){
			this.getUsers();
		}
	}

	componentWillUnmount(){
		clearInterval(this.IntervalGetUsers);
	}

	setSearch(event){
		let search = event.target.value;
		this.setState({
			'search' : search
		});
	}

	setBlocked(event){
		let checked = event.target.checked;
		if(checked !== true){
			this.setState({
				'blocked' : false
			});
		} else {
			this.setState({
				'blocked' : true
			});
		}
	}

	setDeleted(event){
		let checked = event.target.checked;
		if(checked !== true){
			this.setState({
				'deleted' : false
			});
		} else {
			this.setState({
				'deleted' : true
			});
		}
	}

	umblockUser(user_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let data = {
			'blocked' : 0
		}

		axios.put(gConf.apiHost+'/users/'+user_id, data, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getUsers();
			}
		});
	}

	blockUser(user_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let data = {
			'blocked' : 1
		}

		axios.put(gConf.apiHost+'/users/'+user_id, data, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getUsers();
			}
		});
	}

	getUsers(){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let filters = '';
		if(this.state.blocked === true){
			filters = filters+'&blocked=true';
		} else {
			filters = filters+'&blocked=false';
		}

		if(this.state.deleted === true){
			filters = filters+'&deleted=true';
		} else {
			filters = filters+'&deleted=false';
		}

		axios.get(gConf.apiHost+'/users/?page=1&limit=10&search='+this.state.search+filters, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.setState({
					'usersList' : res.data.data[0],
					'usersListPages' : res.data.data[1]
				});
			}
		});
	}

	render(){
		let language = this.context;

		var usersList = this.state.usersList.map((users) =>
			<div key={users.id} className="row lottery-DashboardUsersList-list-item">
				<div className="col-md-1"><span>{users.id}</span></div>
				<div className="col-md-3"><span>{users.email}</span></div>
				<div className="col-md-2">
					<i className="fab fa-btc lottery-color-orange"></i> 

					{
						((
							((users.deposits_sum === null ? 0 : users.deposits_sum) - 
							(users.withdrawal_sum === null ? 0 : users.withdrawal_sum)) - 
							(users.tickets_sum === null ? 0 : users.tickets_sum)
						) / 1e8).toFixed(8)
					}
				</div>
				<div className="col-md-4">
					<span className="badge badge-info p-2" title={users.account_checked === 1 ? 'Account Checked!' : 'Account not checkt!'}>
						{users.account_checked === 1 ? (
							"Confirmada"
						) : (
							"Nao Confirmado"
						)}
					</span>

					{users.deleted === 1 ? (
						<span className="badge badge-danger p-2" title="Account Deleted!">
							Deleted
						</span>
					) : ('')}

					{users.blocked === 1 ? (
						<span className="badge badge-danger p-2" title="Account Blocked!">
							Blocked
						</span>
					) : ('')}
				</div>
				<div className="col-md-2">
					<Link to="#" title={users.blocked === 1 ? 'Click to unblock user' : 'Click to block user'} onClick={users.blocked === 1 ? () => {this.umblockUser(users.id)} : () => {this.blockUser(users.id)}}>
						{users.blocked === 1 ? (
							<i className="fas fa-user-alt"></i>
						) : (
							<i className="fas fa-user-alt-slash"></i>
						)}
					</Link>

					{users.blocked === 0 ? (
						<Link to="#" title="Click to edit user"><i className="far fa-edit"></i></Link>
					) : (
						''
					)}

					<Link to="#" title="Click to delete user"><i className="far fa-trash-alt"></i></Link>
				</div>
			</div>
		);
		
		return(
			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardUsersList">
					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">
					
							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardTicketsList-box">
									<BreadCrumbs titulo={language.page_dashboard_users} type="compact" home="/dashboard"/>

									<div className="lottery-DashboardUsersList-search">
										<div className="input-group">
									 		<input type="text" className="form-control" placeholder="O que você procura" onChange={this.setSearch} value={this.state.search}/>
								 			<div className="input-group-append">
											    <button type="button" className="lottery-DashboardUsersList-bt-search lottery-bg-blue" onClick={this.getUsers}>Buscar</button>
								  			</div>
										</div>

										<div className="lottery-DashboardUsersList-filters">
								  			<div className="row">
									  			<div className="col-md-12">
										  			<label>Filtros: </label>

												    <input type="checkbox" name="filter_blocked" id="filter_blocked" checked={this.state.blocked} onChange={this.setBlocked}/>
												    <label htmlFor="filter_blocked">Blocked</label>

												    <input type="checkbox" name="filter_deleted" id="filter_deleted" checked={this.state.deleted} onChange={this.setDeleted}/>
												    <label htmlFor="filter_deleted">Deleted</label>
											    </div>
											</div>
									  	</div>
									</div>

									<div className="lottery-DashboardUsersList-list-box">
										<div className="container">
											<div className="lottery-DashboardUsersList-list-title">
												<div className="row lottery-DashboardUsersList-list-item">
													<div className="col-md-1">#</div>
													<div className="col-md-3">E-mail</div>
													<div className="col-md-2">Saldo</div>
													<div className="col-md-4">Status</div>
													<div className="col-md-2">Ações</div>
												</div>
											</div>

											<div className="lottery-DashboardUsersList-list">
												{usersList.length > 0 ? usersList : <div className="row lottery-DashboardUsersList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
											</div>
										</div>
									</div>
								</div>

							</div>{/* ./col */}

						</div>{/* ./row */}

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

DashboardUsersList.contextType = LanguageContext;

export default DashboardUsersList;