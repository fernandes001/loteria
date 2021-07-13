import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import DashboardWithdrawal from '../DashboardWithdrawal/DashboardWithdrawal';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';

import './DashboardWithdrawalList.css';

class DashboardWithdrawalList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,
			'withdrawalList' : [],
			'withdrawalListPages' : [],
			'withdrawal_modal_counter' : 0
		};

		this.withdrawalModal = this.withdrawalModal.bind(this);
		this.getWithdrawal = this.getWithdrawal.bind(this);

		//refs
		this.refDashboardWithdrawal = React.createRef();
		this.confirmWithdrawal = this.confirmWithdrawal.bind(this);
	}

	componentDidMount(){
		this.getWithdrawal();

		this.withdrawalInterval = setInterval(() => {
			this.getWithdrawal();
		}, 15000);
	}

	componentDidUpdate(prevProps, prevState){
		
	}

	componentWillUnmount(){
		clearInterval(this.withdrawalInterval);
	}

	async getWithdrawal(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.get(gConf.apiHost+'/withdrawal/?page=1&limit=10', {headers : headers}).then(res => {
			if(res.data.result !== null){
				this.setState({
					'withdrawalList' : res.data.result[0],
					'withdrawalListPages' : res.data.result[1]
				});
			}
		});
	}

	confirmWithdrawal(){
		new Promise((resolve, reject) => {
			resolve(this.refDashboardWithdrawal.current.confirmWithdrawal());
		}).then((response) => {
			this.getWithdrawal();
		});
	}

	withdrawalModal(){
		this.setState({
			'withdrawal_modal_counter' : new Date().getTime()
		});
	}

	render(){
		let language = this.context;

		let withdrawalList = this.state.withdrawalList.map((withdrawal) => 
			<div key={withdrawal.id} className="row lottery-DashboardWithdrawalList-list-item">
				<div className="col-md-1">{withdrawal.id}</div>
				<div className="col-md-3">{withdrawal.dt_created}</div>
				<div className="col-md-4">{withdrawal.to_address}</div>
				<div className="col-md-2">
					<i className="fab fa-btc lottery-color-orange"></i>&nbsp;
					{(withdrawal.amount / 1e8)}
				</div>
				<div className="col-md-2">
					{withdrawal.status === 'completed' ? (
						<span className="badge badge-success p-2">{withdrawal.status}</span>
					) : withdrawal.status === 'pending' ? (
						<span className="badge badge-success p-2">{withdrawal.status}</span>
					) : ''}
				</div>
			</div>
		);

		return(
			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardWithdrawalList">
					
					{/* /container */}
					<div className="container">
						{/* /row */}
						<div className="row">
					
							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardWithdrawalList-box">
									<BreadCrumbs titulo={language.page_dashboard_withdrawal} type="compact" home="/dashboard"/>

									<div className="lottery-DashboardWithdrawalList-search">
										<div className="input-group">
									 		<input type="text" className="form-control" placeholder="O que você procura"/>
								 			<div className="input-group-append">
											    <button type="button" className="lottery-DashboardWithdrawalList-bt-search lottery-bg-blue">Buscar</button>
								  			</div>
										</div>

										<div className="lottery-DashboardWithdrawalList-filters">
								  			<div className="row">
									  			<div className="col-md-8">
										  			
											    </div>

											    <div className="col-md-4 lottery-DashboardWithdrawalList-menu">
													<Link to="#" data-toggle="modal" data-target="#newWithdrawal" onClick={this.withdrawalModal}><i className="fas fa-minus"></i> Retirar</Link>
												</div>
											</div>
									  	</div>
									</div>
									
									<div className="modal fade" id="newWithdrawal" tabIndex="-1" role="dialog" aria-labelledby="newWithdrawal" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="newWithdrawal">Retirar Bitcoin</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body">
							      					<DashboardWithdrawal userId={this.state.userId} userLevel={this.state.userLevel} ref={this.refDashboardWithdrawal} counterModal={this.state.withdrawal_modal_counter}/>
										      	</div>
									      		
										     	<div className="modal-footer">
											        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Cancelar</button>
											        <button type="button" className="btn btn-sm btn-primary" onClick={this.confirmWithdrawal}>Confirmar</button>
										     	</div>
										    </div>
								  		</div>
									</div>
									
									<div className="lottery-DashboardWithdrawalList-list-box">
										<div className="container">
											<div className="lottery-DashboardWithdrawalList-list-title">
												<div className="row lottery-DashboardWithdrawalList-list-item">
													<div className="col-md-1 ">#</div>
													<div className="col-md-3">Date</div>
													<div className="col-md-4">Address</div>
													<div className="col-md-2">Amount</div>
													<div className="col-md-2">Progress</div>
												</div>
											</div>

											<div className="lottery-DashboardWithdrawalList-list">
												{withdrawalList.length > 0 ? withdrawalList : <div className="row lottery-DashboardWithdrawalList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
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

DashboardWithdrawalList.contextType = LanguageContext;

export default DashboardWithdrawalList;