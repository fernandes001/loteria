import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';

import './DashboardDepositsList.css';

class DashboardDepositsList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,
			'depositsList' : [],
			'depositsListPages' : [],
			'addressGenerated' : false,
			'address' : 'Não feche, aguarde...'
		};

		this.generateNewAddress = this.generateNewAddress.bind(this);
		this.clearAddressGenerated = this.clearAddressGenerated.bind(this);
	}

	componentDidMount(){
		this.getDeposits();

		this.intervalGetDeposits = setInterval(() => {
			this.getDeposits();
		}, 10000);
	}

	componentWillUnmount(){
		clearInterval(this.intervalGetDeposits);
	}

	clearAddressGenerated(){
		this.setState({
			'addressGenerated' : false
		});
	}

	updateDepositStatus(id){
		console.log('aqui');
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let data = {
			'id' : id
		}

		axios.post(gConf.apiHost+'/deposits/status', data, {headers : headers}).then(
			res => {
				if(res.data.msgType === 2){
					//
				}
			},
			error => {

			}
		);
	}

	async generateNewAddress(){
		this.setState({
			'addressGenerated' : true
		});

		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.post(gConf.apiHost+'/deposits', {}, {headers : headers}).then(res => {
			if(res.data.msgType === 1){
				this.setState({
					'address' : res.data.response
				});
			} else if(res.data.msgType === 2){
				this.setState({
					'address' : res.data.data.address
				});
				this.getDeposits();
			}
		});
	}

	async getDeposits(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.get(gConf.apiHost+'/deposits/?page=1&limit=10', {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.setState({
					'depositsList' : res.data.data[0],
					'depositsListPages' : res.data.data[1]
				});
			}
		});
	}

	render(){
		let language = this.context;

		let depositsList = this.state.depositsList.map((deposits) =>
			<div key={deposits.id} className="row lottery-DashboardDepositsList-list-item">
				<div className="col-md-1">{deposits.id} {deposits.status !== 'completed' ? this.updateDepositStatus(deposits.id) : ''}</div>
				<div className="col-md-3">{deposits.dt_created}</div>
				<div className="col-md-4">{deposits.address}</div>
				<div className="col-md-2">
					<i className="fab fa-btc lottery-color-orange"></i>&nbsp;
					{deposits.amount === null ? (
						'0.00000000'
					) : (
						(deposits.amount / 1e8).toFixed(8)
					)}
				</div>
				<div className="col-md-2">
					{deposits.status === 'canceled' ? (
						<span className="badge badge-danger p-2">{deposits.status}</span>
					) : deposits.status === 'unconfirmed' ? (
						<span className="badge badge-secondary p-2">{deposits.status}</span>
					) : deposits.status === 'progress' ? (
						<span className="badge badge-primary p-2">{deposits.status}</span>
					) : deposits.status === 'completed' ? (
						<span className="badge badge-success p-2">{deposits.status}</span>
					) : ''}
				</div>
			</div>
		);

		return(
			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardDepositsList">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">

							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardDepositsList-box">
									<BreadCrumbs titulo={language.page_dashboard_deposits} type="compact" home="/dashboard"/>

									<div className="lottery-DashboardDepositsList-search">
										<div className="input-group">
									 		<input type="text" className="form-control" placeholder="O que você procura" />
								 			<div className="input-group-append">
											    <button type="button" className="lottery-DashboardDepositsList-bt-search lottery-bg-blue">Buscar</button>
								  			</div>
								  		</div>

								  		<div className="lottery-DashboardDepositsList-filters">
								  			<div className="row">
									  			<div className="col-md-8">
										  			
											    </div>

											    <div className="col-md-4 lottery-DashboardDepositsList-menu">
													<Link to="#" data-toggle="modal" data-target="#newDeposit" onClick={this.clearAddressGenerated}><i className="fas fa-plus"></i> Depositar</Link>
												</div>
											</div>
									  	</div>
									</div>

									<div className="modal fade" id="newDeposit" tabIndex="-1" role="dialog" aria-labelledby="newDeposit" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="newDeposit">Depositar Bitcoin</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body text-center">
								      				{this.state.addressGenerated === false ? (
								      					<React.Fragment>
												        	<h4><p>IMPORTANTE!</p></h4>
															<p>Será criado um endereço de Bitcoin único e exclusivo que será válido somente para este depósito.</p>
															<p>Você entendeu?</p>
														</React.Fragment>
										      		) : (
										      			<p>{this.state.address}</p>
									      			)}
										      	</div>
									      		
										     	<div className="modal-footer">
										     		{this.state.addressGenerated === false ? (
										     			<React.Fragment>
													        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Não</button>
													        <button type="button" className="btn btn-sm btn-primary" onClick={this.generateNewAddress}>Sim</button>
										     			</React.Fragment>
										     		) : (
										     			<button type="button" className="btn btn-sm btn-primary" data-dismiss="modal">Pronto</button>
										     		)}
										     	</div>
										    </div>
								  		</div>
									</div>

									<div className="lottery-DashboardDepositsList-list-box">
										<div className="container">
											<div className="lottery-DashboardDepositsList-list-title">
												<div className="row lottery-DashboardDepositsList-list-item">
													<div className="col-md-1">#</div>
													<div className="col-md-3">Data</div>
													<div className="col-md-4">Address</div>
													<div className="col-md-2">Amount</div>
													<div className="col-md-2">Progress</div>
												</div>
											</div>

											<div className="lottery-DashboardDepositsList-list">
												{depositsList.length > 0 ? depositsList : <div className="row lottery-DashboardDepositsList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
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

DashboardDepositsList.contextType = LanguageContext;

export default DashboardDepositsList;