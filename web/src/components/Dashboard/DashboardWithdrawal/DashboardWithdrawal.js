import React, { Component } from 'react';

import axios from 'axios';

import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './DashboardWithdrawal.css';

class DashboardWithdrawal extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'alert' : 0,
			'alertMsg' : [],
			'amount' : null,
			'amount_isvalid' : false,
			'to' : null,
			'to_isvalid' : false,
			'memo' : null,
			'balance' : null,
			'minimum_transaction' : (0.001 * 1e8).toFixed(),
			'fee_transaction' : null,
			'insufficient_balance_msg' : false,

			'isvalid_amount' : '',
			'isvalid_to' : ''
		};

		this.getBalance = this.getBalance.bind(this);
		this.getFee = this.getFee.bind(this);
		this.setAmount = this.setAmount.bind(this);
		this.setTo = this.setTo.bind(this);
		this.setMeno = this.setMeno.bind(this);
		this.validateAddress = this.validateAddress.bind(this);
		this.confirmWithdrawal = this.confirmWithdrawal.bind(this);
		this.resetState = this.resetState.bind(this);
		this.alert = this.alert.bind(this);
	}

	componentDidMount(){
		
	}

	componentWillUnmount(){

	}

	componentDidUpdate(prevProps, prevState){
		// get balance every time to the counter changed
		if(prevProps.counterModal !== this.props.counterModal){
			console.log('DashboardWithdrawal: ', this.props.counterModal);
			this.resetState();
			this.getBalance();
		}

		if(this.state.to_isvalid === true && this.state.amount_isvalid === true && this.state.fee_transaction === null){
			this.getFee();
		}
	}
	
	resetState(){
		this.setState({
			'alert' : 0,
			'alertMsg' : [],
			'amount' : null,
			'amount_isvalid' : false,
			'to' : null,
			'to_isvalid' : false,
			'memo' : null,
			'balance' : null,
			'minimum_transaction' : (0.001 * 1e8).toFixed(),
			'fee_transaction' : null,
			'insufficient_balance_msg' : false,

			'isvalid_amount' : '',
			'isvalid_to' : ''
		});
	}

	setAmount(event){
		let amount = event.target.value;

		let fee_transaction = this.state.fee_transaction !== null ? (this.state.fee_transaction * 1e8).toFixed() : 0;
		let minimum_transaction = this.state.minimum_transaction;
		let balance = this.state.balance;
		let amount_temp = parseInt((amount * 1e8).toFixed());

		if( ((this.state.balance - fee_transaction) - parseInt((amount * 1e8).toFixed())) < 0 ){
			this.setState({
				'insufficient_balance_msg' : true
			});
		} else {
			this.setState({
				'insufficient_balance_msg' : false
			});
		}

		if( amount_temp < minimum_transaction || (balance - fee_transaction ) - amount_temp < 0 || amount_temp > (balance - fee_transaction) ||  amount_temp === 0 ){
			this.setState({
				'isvalid_amount' : ' is-invalid',
				'amount_isvalid' : false
			});
		} else {
			this.setState({
				'isvalid_amount' : ' is-valid',
				'amount_isvalid' : true
			});
		}

		this.setState({
			'amount' : amount
		});
	}

	setTo(event){
		let to = event.target.value;

		this.setState({
			'to' : to
		});
	}

	setMeno(event){
		let memo = event.target.value;

		this.setState({
			'memo' : memo
		});
	}

	async confirmWithdrawal(){
		let amount_isvalid = this.state.amount_isvalid;
		let to_isvalid = this.state.to_isvalid;
		let fee_transaction = this.state.fee_transaction;

		if(amount_isvalid === true && to_isvalid === true && fee_transaction !== null){
			let token = localStorage.getItem('token');

			let headers = {
				'Authorization' : token
			}

			let data = {
				'amount' : this.state.amount,
				'fee' : this.state.fee_transaction,
				'to_address' : this.state.to
			};

			await axios.post(gConf.apiHost+'/withdrawal/', data, {headers : headers}).then(res => {
				console.log(res.data);
				if(res.data.error === null){
					this.resetState();
					this.getBalance();
					this.alert(res.data.result, 'success');
				} else {
					this.alert(res.data.error.message, 'danger');
				}
			});
		} else {
			if(amount_isvalid === false){
				this.setState({
					'isvalid_amount' : ' is-invalid',
				});
			}

			if(to_isvalid === false){
				this.setState({
					'isvalid_to' : ' is-invalid',
				});
			}
		}
	}

	async validateAddress(){
		let to = this.state.to;

		if(to !== null && to.length >= 34){
			let token = localStorage.getItem('token');

			let headers = {
				'Authorization' : token
			}

			await axios.get(gConf.apiHost+'/withdrawal/'+to, {headers : headers}).then(res => {
				let data = res.data;

				if(data.result.isvalid === true){
					this.setState({
						'isvalid_to' : ' is-valid',
						'to_isvalid' : true
					});
				} else {
					this.setState({
						'isvalid_to' : ' is-invalid',
						'to_isvalid' : false
					});
				}
			});
		} else {
			this.setState({
				'isvalid_to' : '',
				'to_isvalid' : false
			});
		}
	}

	alert(msg, type){
		var alert = this.state.alertMsg;

		// clear the first array element
		if(Object.keys(this.state.alertMsg).length === 5){
			alert.shift();
		}
		
		alert.push({"msg" : <Alert key={this.state.alert} msg={msg} type={type}/>});

		this.setState({
			'alert' : this.state.alert+1,
			'alertMsg' : alert
		});	
	}

	async getBalance(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.get(gConf.apiHost+'/users/balance/'+this.state.userId, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				//if(this._isMounted){
					this.setState({
						'balance' : res.data.data.balance
					});
				//}
			}
		});
	}

	async getFee(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let data = {
			'amount' : this.state.amount,
			'to' : this.state.to
		}

		await axios.post(gConf.apiHost+'/withdrawal/getfee', data, {headers : headers}).then(res => {
			if(res.data.error === null){
				this.setState({
					'fee_transaction' : res.data.result.fee
				});
			}
		});
	}

	render(){
		
		return(
			<React.Fragment>
				<div className="lottery-DashboardWithdrawal-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				{/* /section */}
				<section className="lottery-DashboardWithdrawal">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">
				
							{/* /col */}
							<div className="col-md-12">
								<div className="lottery-DashboardWithdrawal-form">
									<div className="form-row">
										<div className="form-group col-md-12">
											<span>Saldo: { ( ( (this.state.balance - (this.state.amount * 1e8).toFixed()) - (this.state.fee_transaction * 1e8).toFixed()  ) / 1e8 ).toFixed(8) }</span>
										</div>

										<div className="form-group col-md-6">
								      		<label htmlFor="amount">Quantidade</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_amount} name="amount" id="amount" placeholder="Quantidade" maxLength="10" autoComplete="off" onChange={this.setAmount} value={this.state.amount !== null ? this.state.amount : ''}/>
									    	<span className="lottery-DashboardWithdrawal-minimo">Minimo 0.00100000</span>
									    </div>

									    <div className="form-group col-md-12">
								      		<label htmlFor="to">Endereço</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_to} name="to" id="to" placeholder="Endereço" onBlur={this.validateAddress} autoComplete="off" onChange={this.setTo} value={this.state.to !== null ? this.state.to : ''}/>
									    </div>

									    <div className="form-group col-md-12">
											<span className="">Quantidade + taxas: { (parseInt((this.state.amount * 1e8).toFixed()) + parseInt((this.state.fee_transaction !== null ? (this.state.fee_transaction * 1e8).toFixed() : 0))) / 1e8 }</span> {this.state.insufficient_balance_msg === true ? (<span className="text-danger">Insufficient balance</span>) : ''}
										</div>

									    <div className="form-group col-md-12">
								      		<label htmlFor="memo">Descricao Pessoal</label>
									    	<input type="text" className={'form-control'} name="memo" id="memo" placeholder="Ex: Pagar cafė" autoComplete="off" onChange={this.setMeno} value={this.state.memo !== null ? this.state.memo : ''}/>
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

export default DashboardWithdrawal;