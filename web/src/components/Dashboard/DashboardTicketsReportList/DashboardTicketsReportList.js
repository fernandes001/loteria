import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './DashboardTicketsReportList.css';

class DashboardTicketsReportList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,

			'alert' : 0,
			'alertMsg' : [],

			'ticketsList' : [],
			'ticketsListPages' : [],

			'lottery' : [],
			'amount' : 0,
			'percent' : 0,
		};

		this.getTickets = this.getTickets.bind(this);
		this.getLottery = this.getLottery.bind(this);
		this.checkMatchLottery = this.checkMatchLottery.bind(this);
	}

	componentDidMount(){
		
	}
	
	componentDidUpdate(prevProps, prevState){
		if(prevProps.count !== this.props.count){
			this.getTickets();
			this.getLottery();
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

	checkMatchLottery(resultNumbers, ticketNumbers){
		let result = JSON.parse(resultNumbers).numbers;
		let ticket = JSON.parse(ticketNumbers).numbers;
		
		result = result.sort().join('-');
		ticket = ticket.sort().join('-');
		
		if(result === ticket){
			return true;
		} else {
			return false;
		}
	}

	async getTickets(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let lottery_id = this.props.lottery_id !== undefined ? this.props.lottery_id : null;

		await axios.get(gConf.apiHost+'/tickets/?lottery_id='+lottery_id+'&page=1&limit=10', {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				//if(this._isMounted){
					this.setState({
						'ticketsList' : res.data.data[0],
						'ticketsListPages' : res.data.data[1]
					});
				//}
			}
		});
	}

	async getLottery(){
		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let lottery_id = this.props.lottery_id !== undefined ? this.props.lottery_id : null;

		await axios.get(gConf.apiHost+'/lotteries/private/'+lottery_id, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				let amount = res.data.data[0].lottery_sum < res.data.data[0].default_prize ? res.data.data[0].default_prize : res.data.data[0];
				let percent = amount / res.data.data[0].lottery_qt_tickets_win;

				this.setState({
					'lottery' : res.data.data[0],
					'amount' : amount,
					'percent' : percent,
				});
			}
		});
	}

	render(){
		var ticketsList = this.state.ticketsList.map((ticket) =>
			<div key={ticket.id} className="row lottery-DashboardTicketsReportList-list-item">
				<div className="col-md-1">{ticket.id}</div>
				<div className="col-md-3">{ticket.ticket_created_at}</div>
				<div className="col-md-6">
					{ticket.lottery_result === null ? (
						<span className="badge badge-info p-2 mr-2" title="Resultado">Aguardando</span>
					) : ('')}

					{ticket.prize_paid === 1 ? (
						<span className="badge badge-success p-2 mr-2" title="Resultado">Pago</span>
					) : (
						<span className="badge badge-info p-2 mr-2" title="Resultado">Não Pago</span>
					)}

					{ticket.lottery_result !== null && this.checkMatchLottery(ticket.lottery_result, ticket.numbers_bet) === true ? (
						<React.Fragment>
							<span className="badge badge-success p-2 mr-2" title="Resultado">Ganhou</span>
							<span className="badge badge-info p-2 mr-2" title="Resultado">
								{((ticket.qt_tickets * this.state.percent) / 1e8).toFixed(8)}
							</span>
						</React.Fragment>
					) : ticket.lottery_result !== null && this.checkMatchLottery(ticket.lottery_result, ticket.numbers_bet) === false ? (
						<span className="badge badge-danger p-2 mr-2" title="Resultado">Perdeu</span>
					) : ('')}
				</div>

				<div className="col-md-2">
					{ticket.lottery_result !== null && this.checkMatchLottery(ticket.lottery_result, ticket.numbers_bet) === true ? (
						<Link to="#" title="Pagar"><i className="fas fa-money-bill"></i></Link>
					) : ticket.lottery_result !== null && this.checkMatchLottery(ticket.lottery_result, ticket.numbers_bet) === false ? (
						''
					) : ('-')}
				</div>
			</div>
		);


		return(
			<React.Fragment>
				<div className="lottery-DashboardTicketsReportList-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				{/* /section */}
				<section className="lottery-DashboardTicketsReportList">

					{/* /container */}
					<div className="container">
					
						<div className="lottery-DashboardTicketsReportList-search">

							<div className="lottery-DashboardTicketsReportList-filters">
					  			<div className="row">
						  			<div className="col-md-8">
							  			<label>Filtros: </label>

							  			<input type="checkbox" name="filter_win" id="filter_win" />
									    <label htmlFor="filter_win">Ganhadores</label>

							  			<input type="checkbox" name="filter_paid" id="filter_paid" />
									    <label htmlFor="filter_paid">Pago</label>

									    <input type="checkbox" name="filter_not_paid" id="filter_not_paid" />
									    <label htmlFor="filter_not_paid">Não pago</label>
								    </div>

								    <div className="col-md-4 text-right">
								    	<span>Acumulado: {this.state.amount}</span>
								    </div>
								</div>
						  	</div>

						</div>

						<div className="lottery-DashboardTicketsReportList-list-box">
							<div className="container">
								<div className="lottery-DashboardTicketsReportList-list-title">
									<div className="row lottery-DashboardTicketsReportList-list-item">
										<div className="col-md-1">#</div>
										<div className="col-md-3">Data</div>
										<div className="col-md-6">Status</div>
										<div className="col-md-2">Ação</div>
									</div>
								</div>

								<div className="lottery-DashboardTicketsReportList-list">
									{ticketsList.length > 0 ? ticketsList : <div className="row lottery-DashboardTicketsReportList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
								</div>
							</div>
						</div>

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

export default DashboardTicketsReportList;