import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './AccountCreate.css';

class AccountCreate extends Component {
	constructor(props){
		super(props);
		this.state = {
			'email' : '',
			'password' : '',
			'passwordConfirm' : '',
			'token' : '',
			'msg' : '',
			'msgClass' : '',

			'alert' : 0,
			'alertMsg' : [],

			'isvalid_email' : '',
			'isvalid_password' : '',
			'isvalid_passwordConfirm' : '',
			'isvalid_token' : '',

			'enable_confirm_account' : false,
			'enable_create_account' : true
		};

		this.setEmail = this.setEmail.bind(this);
		this.setPassword = this.setPassword.bind(this);
		this.setPasswordConfirm = this.setPasswordConfirm.bind(this);
		this.setToken = this.setToken.bind(this);
		this.createUser = this.createUser.bind(this);
		this.alert = this.alert.bind(this);
		this.validateFields = this.validateFields.bind(this);
		this.validateToken = this.validateToken.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.confirmAccount = this.confirmAccount.bind(this);
	}

	setEmail(event){
		let email = event.target.value;
		this.setState({
			'email' : email
		});
	}

	setPassword(event){
		let password = event.target.value;
		this.setState({
			'password' : password
		});
	}

	setPasswordConfirm(event){
		let passwordConfirm = event.target.value;

		this.setState({
			'passwordConfirm' : passwordConfirm
		});
	}

	setToken(event){
		let token = event.target.value;

		this.setState({
			'token' : token
		});
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

	validateFields(){
		let fields = [];

		if(this.state.email === ''){
			this.setState({
				'isvalid_email' : ' is-invalid'
			});
			fields.push('email');
		} else {
			this.setState({
				'isvalid_email' : ' is-valid'
			});
		}

		if(this.state.password === ''){
			this.setState({
				'isvalid_password' : ' is-invalid'
			});
			fields.push('password');
		} else {
			this.setState({
				'isvalid_password' : ' is-valid'
			});
		}

		if(this.state.passwordConfirm === ''){
			this.setState({
				'isvalid_passwordConfirm' : ' is-invalid'
			});
			fields.push('passwordConfirm');
		} else {
			this.setState({
				'isvalid_passwordConfirm' : ' is-valid'
			});
		}

		// check if password match with password confirm
		if(this.state.password !== '' && this.state.passwordConfirm !== ''){
			if(this.state.password !== this.state.passwordConfirm){
				this.setState({
					'isvalid_passwordConfirm' : ' is-invalid'
				});
				this.alert("Senhas diferentes", 'warning');
				fields.push('passwordConfirm');
			} else {
				this.setState({
					'isvalid_passwordConfirm' : ' is-valid'
				});
			}
		}

		if(fields.length > 0){
			return false;
		} else {
			return true;
		}
	}

	validateToken(){
		let fields = [];

		if(this.state.token === ''){
			this.setState({
				'isvalid_token' : ' is-invalid'
			});
			fields.push('token');
		} else {
			this.setState({
				'isvalid_token' : ' is-valid'
			});
		}

		if(fields.length > 0){
			return false;
		} else {
			return true;
		}
	}

	resetForm(){
		this.setState({
			'email' : '',
			'password' : '',
			'passwordConfirm' : '',
			'msg' : '',
			'msgClass' : '',

			'isvalid_email' : '',
			'isvalid_password' : '',
			'isvalid_passwordConfirm' : ''
		});
	}

	async confirmAccount(event){
		event.preventDefault();

		let validate = this.validateToken();
		if(!validate){
			return false;
		}

		await axios.get(gConf.apiHost+'/users/confirm/'+this.state.token).then(res => {
			//if(this._isMounted){
			if(res.data.error !== null){
				this.alert(res.data.error.message, 'warning');
			} else {
				this.setState({
					'token' : '',
					'isvalid_token' : ''
				});
				this.alert(res.data.result, 'success');
			}
			//}
		});
	}

	createUser(event){
		event.preventDefault();

		let validate = this.validateFields();
		if(!validate){
			return false;
		}

		this.setState({
			'msg' : ''
		});	

		this.setState({
			'msgClass' : ' text-info',
			'msg' : 'Aguarde...'
		});

		let data = {
			'email' : this.state.email,
			'password' : this.state.password
		}

		axios.post(gConf.apiHost+'/users/', data).then(res => {
			if(res.data.msgType === 0){
			
				this.alert(res.data.response, 'danger');
				this.setState({
					'msg' : ''
				});
			
			} else if(res.data.msgType === 1){
				
				if(res.data.data !== null){
					if(res.data.data.field !== undefined && res.data.data.field === 'email'){
						this.setState({
							'isvalid_email' : ' is-invalid'
						});
					}
				}

				this.alert(res.data.response, 'warning');
				this.setState({
					'msg' : ''
				});

			} else if(res.data.msgType === 2){ // success
				this.setState({
					'enable_confirm_account' : true,
					'enable_create_account' : false
				});
				this.alert(res.data.response, 'success');
				this.resetForm();

			}
		}, error => {
			if(error.response.data.msgType === 0){
				this.alert(error.response.data.response, 'danger');
			}
		});
		
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
				<div className="lottery-AccountCreate-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				<BreadCrumbs titulo={language.page_account_create} home="/"/>

				{/* /section */}
				<section className="lottery-AccountCreate">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row justify-content-md-center">
					
							{/* /col */}
							<div className="col-md-6">
								<div className="lottery-AccountCreate-box">
									<div className={'lottery-AccountCreate-msg' + this.state.msgClass}>
										{this.state.msg}
									</div>

									{this.state.enable_create_account === true ? (
										<div className="form-group">
											<form onSubmit={this.createUser}>
												<label>{language.label_email}</label>
												<input type="text" name="email" className={"form-control" + this.state.isvalid_email} placeholder={language.placeholder_email} value={this.state.email} onChange={this.setEmail}/>

												<label className="mt-2">{language.label_password}</label>
												<input type="password" name="password" className={"form-control" + this.state.isvalid_password} placeholder={language.placeholder_password} value={this.state.password} onChange={this.setPassword}/>

												<label className="mt-2">{language.label_password_confirm}</label>
												<input type="password" name="confirm_password" className={"form-control" + this.state.isvalid_passwordConfirm} placeholder={language.placeholder_password_confirm} value={this.state.passwordConfirm} onChange={this.setPasswordConfirm}/>
												
												<div className="row">
													<div className="col-md-12 text-right">
														<button type="submit" className="lottery-AccountCreate-bt lottery-bt-rounded lottery-bg-blue">{language.bt_create}</button>
													</div>
												</div>
											</form>
										</div>
									) : ''}
									
									{this.state.enable_confirm_account === true ? (
										<div className="form-group">
											<form onSubmit={this.confirmAccount}>
												<label className="mt-2">{language.label_account_confirm}</label>
												<input type="text" name="token" className={"form-control" + this.state.isvalid_token} autoComplete="off" placeholder={language.placeholder_token} value={this.state.token} onChange={this.setToken}/>
												
												<div className="row">
													<div className="col-md-12 text-right">
														<button type="submit" className="lottery-AccountCreate-bt lottery-bt-rounded lottery-bg-blue">{language.bt_confirm}</button>
													</div>
												</div>
											</form>
										</div>
									) : ''}
								</div>
							</div>{/* ./col */}

							{this.state.enable_create_account === true ? (
								<div className="lottery-AccountCreate-login-account">
									<Link to="/account/login">{language.account_haveaccount}</Link>
								</div>
							) : (
								<div className="lottery-AccountCreate-login-account">
									<Link to="/account/login">{language.account_access}</Link>
								</div>
							)}
							
						</div>{/* ./row */}

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

AccountCreate.contextType = LanguageContext;

export default AccountCreate;