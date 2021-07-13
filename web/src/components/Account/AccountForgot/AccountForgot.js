import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './AccountForgot.css';

class AccountForgot extends Component{
	constructor(props){
		super(props);
		this.state = {
			'email' : '',
			'msg' : '',
			'msgClass' : '',

			'alert' : 0,
			'alertMsg' : [],

			'isvalid_email' : ''	
		};

		this.alert = this.alert.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.validateEmail = this.validateEmail.bind(this);
	}

	componentDidMount(){

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

	setEmail(event){
		let email = event.target.value;
		this.setState({
			'email' : email
		});
	}

	validateEmail(){
		let fields = [];

		if(this.state.email === ""){
			this.setState({
				'isvalid_email' : ' is-invalid'
			});
			fields.push('email');
		} else {
			this.setState({
				'isvalid_email' : ' is-valid'
			});
		}

		if(fields.length > 0){
			return false;
		} else {
			return true;
		}
	}

	forgotPassword(event){
		event.preventDefault();

		let validate = this.validateEmail();
		if(!validate){
			return false;
		}

		this.setState({
			'msgClass' : ' text-info',
			'msg' : 'Aguarde...'
		});

		let data = {
			'email' : this.state.email
		}

		axios.post(gConf.apiHost+'/users/resetpassword', data).then(res => {
			//if(this._isMounted){
			if(res.data.error !== null){
				this.alert(res.data.error.message, 'warning');
				this.setState({
					'msg' : '',
					'isvalid_email' : ' is-invalid'
				});
			} else {
				this.alert(res.data.result, 'success');
				this.setState({
					'msg' : '',
					'isvalid_email' : ''
				});
			}
			//}
		});
	}

	render(){
		let language = this.context;

		return(
			<React.Fragment>
				<div className="lottery-AccountForgot-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				<BreadCrumbs titulo={language.page_account_forgotpassword} home="/"/>

				{/* /section */}
				<section className="lottery-AccountForgot">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row justify-content-md-center">
							
							{/* /col */}
							<div className="col-md-6">
								<div className="lottery-AccountForgot-box">
									<div className={'lottery-AccountForgot-msg' + this.state.msgClass}>
										{this.state.msg}
									</div>

									<div className="form-group">
										<form onSubmit={this.forgotPassword}>
											<label htmlFor="email">{language.label_email}</label>
											<input type="text" name="email" className={"form-control" + this.state.isvalid_email} name="email" id="email" placeholder={language.placeholder_email} value={this.state.email} onChange={this.setEmail}/>

											<div className="row">
												<div className="col-md-12 text-right">
													<button type="submit" className="lottery-AccountForgot-bt lottery-bt-rounded lottery-bg-blue">{language.bt_send}</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>{/* ./col */}

							<div className="lottery-AccountForgot-create-account">
								<div><Link to="/account/login">{language.account_access}</Link></div>
								<div><Link to="/account/create">{language.account_create}</Link></div>
							</div>

						</div>{/* ./row */}

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

AccountForgot.contextType = LanguageContext;

export default AccountForgot;