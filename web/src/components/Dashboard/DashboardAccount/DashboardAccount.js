import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Alert from '../../Alert/Alert';

import gConf from '../../../config/global.json';

import './DashboardAccount.css';

class DashboardAccount extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,

			'alert' : 0,
			'alertMsg' : [],

			'password' : '',
			'email' : '',
			'amount' : '',

			'isvalid_password' : ''
		};

		this.setPassword = this.setPassword.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.alert = this.alert.bind(this);
		this.getUserData = this.getUserData.bind(this);
	}

	componentDidMount(){
		this.getUserData();

		this.intervalGetUserData = setInterval(() => {
			this.getUserData();
		}, 60000);
	}

	componentWillUnmount(){
		clearInterval(this.intervalGetUserData);
	}

	alert(msg, type){
		var alert = this.state.alertMsg;

		// clear the first array element
		if(Object.keys(this.state.alertMsg).length === 5){
			alert.shift();
		}
		
		alert.push({"msg" : <Alert key={this.state.alert}  msg={msg} type={type}/>});

		this.setState({
			'alert' : this.state.alert+1,
			'alertMsg' : alert
		});	
	}

	setPassword(event){
		let password = event.target.value;

		if(this.state.password.length < 5){
			this.setState({
				'isvalid_password' : ' is-invalid'
			});
		} else {
			this.setState({
				'isvalid_password' : ' is-valid'
			});
		}

		this.setState({
			'password' : password
		});
	}

	async updatePassword(event){
		event.preventDefault();

		if(this.state.password.length < 5){
			return false;
		}

		let token = localStorage.getItem('token');
		let password = this.state.password;

		let headers = {
			'Authorization' : token
		}

		let data = {
			'password' : password
		}

		await axios.put(gConf.apiHost+'/users/'+this.state.userId, data, {headers : headers}).then(
			res => {
				if(res.data.msgType === 1){
					this.alert(res.data.response, 'warning');
				} else if(res.data.msgType === 2) {
					this.alert(res.data.response, 'success');
					this.setState({
						'isvalid_password' : ''
					});
				}
			},
			err => {
				this.alert(err.response.data.response, 'danger');
			}
		);
	}
	
	async getUserData(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.get(gConf.apiHost+'/users/'+this.state.userId, {headers : headers}).then(
			res => {
				if(res.data.msgType === 2){
					let deposits_sum = res.data.data.deposits_sum;
					let tickets_sum = res.data.data.tickets_sum;
					let withdrawal_sum = res.data.data.withdrawal_sum;

					if(deposits_sum === null){
						deposits_sum = 0;
					}

					if(tickets_sum === null){
						tickets_sum = 0;
					}

					if(withdrawal_sum === null){
						withdrawal_sum = 0;
					}

					let amount = (deposits_sum - tickets_sum) - withdrawal_sum;
					amount = (amount / 1e8).toFixed(8);

					this.setState({
						'email' : res.data.data.email,
						'amount' : amount
					});
				}
			},
			err => {
				this.alert(err.response.data.response, 'danger');
			}
		);
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
				<div className="lottery-DashboardAccount-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardAccount">
					
					{/* /container */}
					<div className="container">
						{/* /row */}
						<div className="row">

							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardAccount-box">
									<BreadCrumbs titulo={language.page_dashboard_account} type="compact" home="/dashboard"/>	
								
									<div className="form-row">
										<div className="form-group col-md-6">
											<div>E-mail: {this.state.email}</div>
											<div>Saldo: {this.state.amount}</div>
										</div>

										<div className="form-group col-md-6">
											<form onSubmit={this.updatePassword}>
												<div className="mb-2">
													<label>{language.label_password_update}</label>
													<input type="password" className={"form-control" + this.state.isvalid_password} id="current_password" name="current_password" placeholder={language.placeholder_password} onChange={this.setPassword} value={this.state.password}/>
												</div>
												
												<div className="text-right">
													<button type="submit" className="lottery-DashboardAccount-bt lottery-bg-blue">{language.bt_save}</button>
												</div>
											</form>
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

DashboardAccount.contextType = LanguageContext;

export default DashboardAccount;