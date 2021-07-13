import React, { Component } from 'react';

import axios from 'axios';

import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './DashboardTickets.css';

class DashboardTickets extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'alert' : 0,
			'alertMsg' : [],
			'lotteryList' : [],
			'numbersList' : [],
			'numbersBet' : [],
			'finalBalance' : null,
			'choiceNumbers' : null,
			'qtTickets' : null,
			'ticketPrice' : null,
			'lotteryId' : null,
			'prize' : null,
			'balance' : null
		};

		this.getLotteries = this.getLotteries.bind(this);
		this.choiceLottery = this.choiceLottery.bind(this);
		this.choiceNumber = this.choiceNumber.bind(this);
		this.qtTicketsAdd = this.qtTicketsAdd.bind(this);
		this.qtTicketsRemove = this.qtTicketsRemove.bind(this);
		this.getBalance = this.getBalance.bind(this);
		
		this.alert = this.alert.bind(this);
		this.create = this.create.bind(this);
	}

	componentDidMount(){
		this._isMounted = true;
		this.getLotteries();
		this.getBalance();

		this.interval = setInterval(() => {
			this.getBalance();
		}, 10000);
	}

	componentWillUnmount(){
		this._isMounted = false;
		clearInterval(this.interval);
	}
	
	qtTicketsAdd(){
		let qtTickets = this.state.qtTickets;
		this.setState({
			'qtTickets' : qtTickets + 1
		});
	}

	qtTicketsRemove(){
		let qtTickets = this.state.qtTickets;
		if(qtTickets >= 1){
			this.setState({
				'qtTickets' : qtTickets - 1
			});
		}
	}

	choiceNumber(event){
		let value = parseInt(event.target.value);
		
		var arr = this.state.numbersBet;
		if(arr.length < this.state.choiceNumbers && arr.indexOf(value) === -1){
			arr.push(value);
			this.setState({
				'numbersBet' : arr
			});
		} else {
			arr.splice(arr.indexOf(value), 1);
			this.setState({
				'numbersBet' : arr
			});
		}

		// console.log(arr);
	}

	choiceLottery(event){
		let value = parseInt(event.target.value);
		let lotteryList = this.state.lotteryList;

		if(!isNaN(value)){
			if(value === 0){
					if(this._isMounted){
					this.setState({
						'choiceNumbers' : null,
						'ticketPrice' : null,
						'lotteryId' : null,
						'qtTickets' : null,
						'numbersList' : [],
						'numbersBet' : [],
						'prize' : null
					});
				}
			} else {
				for(var i = 0; i < lotteryList.length; i++){				
					if(lotteryList[i].id === value){
						let selected = lotteryList[i];
	
						if(this._isMounted){
							let prize = 0;
							if(selected.default_prize > selected.lottery_sum){
								prize = (selected.default_prize / 1e8).toFixed(8);
							} else {
								prize = (selected.lottery_sum / 1e8).toFixed(8);
							}

							this.setState({
								'choiceNumbers' : selected.choice_numbers,
								'ticketPrice' : selected.ticket_price,
								'lotteryId' : selected.id,
								'qtTickets' : 1,
								'numbersList' : [],
								'numbersBet' : [],
								'prize' : prize
							});
						}
					
						let numbers = selected.numbers_count;
						numbers = numbers.split('-');

						let arr = [];
						for(var iAux = parseInt(numbers[0]); iAux <= parseInt(numbers[1]); iAux++){
							arr.push({'number' : iAux});
						}

						if(this._isMounted){
							this.setState({
								'numbersList' : arr
							});
						}
					}
				}
			}
		}
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

	async getLotteries(){
		await axios.get(gConf.apiHost+'/lotteries/public/?page=1&limit=10&result=false&deleted=false&blocked=false&search=').then(res => {
			if(res.data.msgType === 2){
				if(this._isMounted){
					this.setState({
						'lotteryList' : res.data.data[0]
					});
				}
			}
		});
	}

	async getBalance(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		await axios.get(gConf.apiHost+'/users/balance/'+this.state.userId, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				if(this._isMounted){
					this.setState({
						'balance' : res.data.data.balance
					});
				}
			}
		});
	}

	async create(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let data = {
			'lottery_id' : this.state.lotteryId,
			'numbers_bet' : this.state.numbersBet.join(', '),
			'qt_tickets' : this.state.qtTickets,
			'ticket_price' : this.state.ticketPrice,
			'choice_numbers' : this.state.choiceNumbers
		}

		await axios.post(gConf.apiHost+'/tickets', data,  {headers : headers}).then(
			res => {
				console.log(res.data);
				if(res.data.msgType === 1){
					this.alert(res.data.response, 'warning');
				} else if(res.data.msgType === 2){
					this.alert(res.data.response, 'success');
				}
			},
			error => {
				let response = error.response.data;
				if(response.msgType === 0){
					this.alert(response.response, 'danger');
				}
			}
		);
	}

	render(){
		let lotteriesList = this.state.lotteryList.map((lotteries) => 
			<option key={lotteries.id} value={lotteries.id}>{lotteries.title}</option>
		);

		let numbersList = this.state.numbersList.map((numbersList) => 	
			<div key={numbersList.number} className="col-4 col-sm-2 text-center pt-3 pb-3">
				<button className={this.state.numbersBet.includes(numbersList.number) === true ? "lottery-DashboardTickets-number-selected" : "lottery-DashboardTickets-number"} value={numbersList.number} onClick={this.choiceNumber}>{numbersList.number}</button>
			</div>
		);

		let final_balance = (this.state.balance - (this.state.ticketPrice * this.state.qtTickets));

		return(
			<React.Fragment>
				<div className="lottery-DashboardTickets-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				{/* /section */}
				<section className="lottery-DashboardTickets">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">
				
							{/* /col */}
							<div className="col-md-12">
								<div className="row">
									<div className="col-md-12 pb-2">Prêmio: <i className="fab fa-btc"></i> {this.state.prize === null ? '0.00000000' : this.state.prize}</div>
								</div>

								<div className="form-row">
									<div className="form-group col-md-12">
							      		<label htmlFor="lottery_title">Loteria</label>
								    	<select className="form-control" name="lottery_title" id="lottery_title" onChange={this.choiceLottery}>
											<option value="0">--</option>
											{lotteriesList}
										</select>
								    </div>
								</div>

								<div className="row">
									<div className="col-md-12 pb-2">Saldo: {(this.state.balance / 1e8).toFixed(8)}</div>
									<div className="col-md-12 pb-2">Preço por bilhete: <span className="lottery-color-red">- {this.state.ticketPrice !== null ? (this.state.ticketPrice / 1e8).toFixed(8) : 0.00000000}</span></div>
									<div className="col-md-12 pb-2">Saldo Final: {(final_balance / 1e8).toFixed(8)} {final_balance < 0 ? <span className="lottery-color-red">Saldo insuficiente!</span> : ''}</div>
									<div className="col-md-12 pb-2">Escolha {this.state.choiceNumbers !== null ? this.state.choiceNumbers : 0} números</div>
								</div>

								<div className="row">
									<div className="col-md-6">Bilhetes: {this.state.qtTickets !== null ? this.state.qtTickets : '0'}</div>
									<div className="col-md-6 text-right"><i className="fas fa-minus lottery-color-blue" onClick={this.qtTicketsRemove}></i> <i className="fas fa-plus lottery-color-blue" onClick={this.qtTicketsAdd}></i></div>
								</div>

								<div className="lottery-DashboardTickets-card">
									<div className="row">
										{numbersList}
									</div>
								</div>

								<div className="row">
									<div className="col-md-12 text-center">
										<div className="lottery-DashboardTickets-selected-numbers">
											<div>Números selecionados:</div>
											<div>{this.state.numbersBet.length > 0 ? this.state.numbersBet.sort(function(a, b){return a-b}).join(', ') : '-'}</div>
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

export default DashboardTickets;