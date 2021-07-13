import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import DashboardTickets from '../DashboardTickets/DashboardTickets';
import gConf from '../../../config/global.json';

import './DashboardTicketsList.css';

class DashboardTicketsList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,
			'ticketsList' : [],
			'ticketsListPages' : []
		};

		this.getTickets = this.getTickets.bind(this);

		// refs
		this.refDashboardTickets = React.createRef();
		this.create = this.create.bind(this);
	}

	componentDidMount(){
		this._isMounted = true;
		this.getTickets();

		this.interval = setInterval(() => {
			this.getTickets();
		}, 30000);
	}
	
	componentWillUnmount(){
		clearInterval(this.interval);
		this._isMounted = false;
	}

	create(){
		this.refDashboardTickets.current.create();
	}

	ckectMatchLottery(resultNumbers, ticketNumbers){
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

		await axios.get(gConf.apiHost+'/tickets/?user_id='+this.state.userId+'&page=1&limit=10', {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				if(this._isMounted){
					this.setState({
						'ticketsList' : res.data.data[0],
						'ticketsListPages' : res.data.data[1]
					});
				}
			}
		});
	}

	render(){
		let language = this.context;

		let ticketsList = this.state.ticketsList.map((tickets) => 
			<div key={tickets.id} className="row lottery-DashboardTicketsList-list-item">
				<div className="col-md-1"><span>{tickets.id}</span></div>
				<div className="col-md-2"><span>{tickets.ticket_created_at}</span></div>
				<div className="col-md-4"><span>{tickets.lottery_name}</span></div>
				<div className="col-md-3">
					{tickets.lottery_result === null ? (
						<span className="badge badge-info p-2" title="Lottery day">Aguardando</span>
					) : tickets.lottery_result !== null && this.ckectMatchLottery(tickets.lottery_result, tickets.numbers_bet) === true ? (
						<React.Fragment>
							<span className="badge badge-success p-2 mr-2">Ganhador</span>
							{tickets.prize_paid !== null ? (
								<span className="badge badge-info p-2">Pago</span>
							) : (
								<span className="badge badge-info p-2">Não pago</span>
							)}
						</React.Fragment>
					) : tickets.lottery_result !== null && this.ckectMatchLottery(tickets.lottery_result, tickets.numbers_bet) === false ? (
						<span className="badge badge-danger p-2">Lose</span>
					) : ''}
				</div>

				<div className="col-md-2">
					<Link to="#" title="Detail" data-toggle="modal" data-target="#ticketDetail"><i className="fas fa-info-circle"></i></Link>
				</div>
			</div>
		);

		return(
			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardTicketsList">
					
					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">
					
							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardTicketsList-box">
									<BreadCrumbs titulo={language.page_dashboard_tickets} type="compact" home="/dashboard"/>

									<div className="lottery-DashboardTicketsList-search">
										<div className="input-group">
									 		<input type="text" className="form-control" placeholder="O que você procura" />
								 			<div className="input-group-append">
											    <button type="button" to="#" className="lottery-DashboardTicketsList-bt-search lottery-bg-blue">Buscar</button>
								  			</div>
										</div>

										<div className="lottery-DashboardTicketsList-filters">
								  			<div className="row">
									  			<div className="col-md-8">
										  			
											    </div>

											    <div className="col-md-4 lottery-DashboardTicketsList-menu">
											    	<Link to="#" data-toggle="modal" data-target="#newTicket"><i className="fas fa-plus"></i> Novo Bilhete</Link>
												</div>
											</div>
									  	</div>
									</div>

									{/* /newTicket */}
									<div className="modal fade" id="newTicket" tabIndex="-1" role="dialog" aria-labelledby="newTicket" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="newTicket">Comprar Bilhete</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body">
								      				<DashboardTickets userId={this.state.userId} userLevel={this.state.userLevel} ref={this.refDashboardTickets}/>
										      	</div>
									      		
										     	<div className="modal-footer">
										     		<React.Fragment>
												        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Cancelar</button>
												        <button type="button" className="btn btn-sm btn-primary" onClick={this.create}>Comprar</button>
									     			</React.Fragment>	
										     	</div>
										    </div>
								  		</div>
									</div>{/* ./newTicket */}

									{/* /ticketDetail */}
									<div className="modal fade" id="ticketDetail" tabIndex="-1" role="dialog" aria-labelledby="ticketDetail" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="ticketDetail">Depositar Bitcoin</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body text-center">
								      				Detalhes
										      	</div>
									      		
										     	<div className="modal-footer">
										     		<React.Fragment>
												        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Sair</button>
									     			</React.Fragment>	
										     	</div>
										    </div>
								  		</div>
									</div>{/* ./ticketDetail */}

									<div className="lottery-DashboardTicketsList-list-box">
										<div className="container">
											<div className="lottery-DashboardTicketsList-list-title">
												<div className="row lottery-DashboardTicketsList-list-item">
													<div className="col-md-1">#</div>
													<div className="col-md-2">Data</div>
													<div className="col-md-4">Loteria</div>
													<div className="col-md-3">Status</div>
													<div className="col-md-2">Ação</div>
												</div>
											</div>

											<div className="lottery-DashboardTicketsList-list">
												{ticketsList.length > 0 ? ticketsList : <div className="row lottery-DashboardTicketsList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
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

DashboardTicketsList.contextType = LanguageContext;

export default DashboardTicketsList;