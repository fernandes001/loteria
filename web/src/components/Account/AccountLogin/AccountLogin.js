import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './AccountLogin.css';

class AccountLogin extends Component{
	constructor(props){
		super(props);
		this.state = {
			'email' : '',
			'password' : '',
			'logged' : false,
			'userId' : '',
			'userLevel' : '',
			'msg' : '',
			'msgClass' : 'lottery-AccountLogin-msg',
			
			'alert' : 0,
			'alertMsg' : [],

			'isvalid_email' : '',
			'isvalid_password' : ''
		};

		this.setEmail = this.setEmail.bind(this);
		this.setPassword = this.setPassword.bind(this);
		this.auth = this.auth.bind(this);
		this.alert = this.alert.bind(this);
		this.validateFields = this.validateFields.bind(this);
	}

	componentDidMount(){

	}

	componentDidUpdate(){
		
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

		if(fields.length > 0){
			return false;
		} else {
			return true;
		}
	}

	auth(event){
		event.preventDefault();
		
		let validate = this.validateFields();
		if(!validate){
			return false;
		}

		this.setState({
			'msg' : ''
		});

		this.setState({
			'msgClass' : 'text-info',
			'msg' : 'Aguarde...'
		});

		let data = {
			'email' : this.state.email,
			'password' : this.state.password
		}

		axios.post(gConf.apiHost+'/auth/', data).then(res => {
			if(res.data.msgType === 0){
				this.alert(res.data.response, 'danger');
				this.setState({
					'msg' : ''
				});
			} else if(res.data.msgType === 1){
				this.alert(res.data.response, 'danger');
				this.setState({
					'msg' : ''
				});
			} else if(res.data.msgType === 2){ // success
				localStorage.setItem('token', "Bearer "+res.data.data.token);
				this.setState({
					'logged' : true,
					'userId' : res.data.data.data.id,
					'userLevel' : res.data.data.data.level
				});
			}
		}, error => {
			if(error.response.data.msgType === 0){
				this.alert(error.response.data.response, 'danger');
				this.setState({
					'msg' : ''
				});
			}
		});
	}

	render(){
		let language = this.context;

		return(
			this.state.logged === true ?
			<Redirect to={{
				pathname: '/dashboard',
				state: {'logged' : true, 'userId' : this.state.userId, 'userLevel' : this.state.userLevel}
			}}/>
			:
			<React.Fragment>
				<div className="lottery-AccountLogin-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				<BreadCrumbs titulo={language.page_account_login} home="/"/>

				{/* /section */}
				<section className="lottery-AccountLogin">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row justify-content-md-center">
							
							{/* /col */}
							<div className="col-md-6">
								<div className="lottery-AccountLogin-box">
									<div className={'lottery-AccountLogin-msg ' + this.state.msgClass}>
										{this.state.msg}
									</div>

									<div className="form-group">
										<form onSubmit={this.auth}>
											<label>{language.label_email}</label>
											<input type="text" className={"form-control" + this.state.isvalid_email} name="email" placeholder={language.placeholder_email} autoComplete="off" value={this.state.email} onChange={this.setEmail}/>

											<label className="mt-2">{language.label_password}</label>
											<input type="password" className={"form-control" + this.state.isvalid_password} name="password" placeholder={language.placeholder_password} autoComplete="off" value={this.state.password} onChange={this.setPassword}/>

											<div className="row">
												<div className="col-md-12 text-right">
													<button type="submit" className="lottery-AccountLogin-bt lottery-bt-rounded lottery-bg-blue">{language.bt_access}</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>{/* ./col */}

							<div className="lottery-AccountLogin-create-account">
								<div><Link to="/account/forgotpassword">{language.account_forgot}</Link></div>
								<div><Link to="/account/create">{language.account_create}</Link></div>
							</div>

						</div>{/* ./row */}

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

AccountLogin.contextType = LanguageContext;

export default AccountLogin;