import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

import {LanguageContext} from '../../../locales/context';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import gConf from '../../../config/global.json';

import DashboardLotteries from '../DashboardLotteries/DashboardLotteries';
import DashboardLotteriesResult from '../DashboardLotteriesResult/DashboardLotteriesResult';
import DashboardTicketsReportList from '../DashboardTicketsReportList/DashboardTicketsReportList';

import './DashboardLotteriesList.css';

class DashboardLotteriesList extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'page' : this.props.page !== undefined ? this.props.page : null,
			'typeModal' : null,
			'lottery_id' : null,
			'search' : '',
			'deleted' : false,
			'blocked' : false,
			'lotteriesList' : [],
			'lotteriesListPages' : [],
			'count' : 0,
		};

		this.refDashboardLotteries = React.createRef();
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);

		this.refDashboardLotteriesResult = React.createRef();
		this.saveResult = this.saveResult.bind(this);

		this.delete = this.delete.bind(this);
		this.restore = this.restore.bind(this);
		this.block = this.block.bind(this);
		this.unBlock = this.unBlock.bind(this);
		this.setTypeModal = this.setTypeModal.bind(this);
		this.setSearch = this.setSearch.bind(this);
		this.setBlocked = this.setBlocked.bind(this);
		this.setDeleted = this.setDeleted.bind(this);
		this.getLotteries = this.getLotteries.bind(this);
		this.setLotteryId = this.setLotteryId.bind(this);
		this.setLotteryIdByTicketClick = this.setLotteryIdByTicketClick.bind(this);
	}

	componentDidMount(){
		this.getLotteries();
	}

	componentDidUpdate(prevProps, prevState){
		// check blocked prevState
		let blocked = this.state.blocked;
		if(prevState.blocked !== blocked){
			this.getLotteries();
		}

		// check deleted prevState
		let deleted = this.state.deleted;
		if(prevState.deleted !== deleted){
			this.getLotteries();
		}
	}

	componentWillUnmount(){

	}

	create(){
		this.refDashboardLotteries.current.create();
	}

	update(){
		this.refDashboardLotteries.current.update();
	}
	
	saveResult(){
		this.refDashboardLotteriesResult.current.update();
	}

	setTypeModal(type, lottery_id = null){
		this.setState({
			'typeModal' : type,
			'lottery_id' : lottery_id
		});
	}

	setLotteryId(lottery_id){
		this.setState({
			'lottery_id' : lottery_id
		});
	}

	setLotteryIdByTicketClick(lottery_id){
		let count = this.state.count;
		count += 1;

		this.setState({
			'lottery_id' : lottery_id,
			'count' : count
		});
	}

	setSearch(event){
		let search = event.target.value;
		this.setState({
			'search' : search
		});
	}

	setBlocked(event){
		let checked = event.target.checked;
		if(checked !== true){
			this.setState({
				'blocked' : false
			});
		} else {
			this.setState({
				'blocked' : true
			});
		}
	}

	setDeleted(event){
		let checked = event.target.checked;
		if(checked !== true){
			this.setState({
				'deleted' : false
			});
		} else {
			this.setState({
				'deleted' : true
			});
		}
	}

	block(lottery_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let data = {
			'blocked' : 1
		}

		axios.put(gConf.apiHost+'/lotteries/'+lottery_id, data, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getLotteries();
			}
		});
	}

	unBlock(lottery_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let data = {
			'blocked' : 0
		}

		axios.put(gConf.apiHost+'/lotteries/'+lottery_id, data, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getLotteries();
			}
		});
	}

	delete(lottery_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		axios.delete(gConf.apiHost+'/lotteries/'+lottery_id, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getLotteries();
			}
		});
	}

	restore(lottery_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let data = {
			'deleted' : 0
		}

		axios.put(gConf.apiHost+'/lotteries/'+lottery_id, data, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.getLotteries();
			}
		});
	}

	getLotteries(){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		let filters = '';
		if(this.state.blocked === true){
			filters = filters+'&blocked=true';
		} else {
			filters = filters+'&blocked=false';
		}

		if(this.state.deleted === true){
			filters = filters+'&deleted=true';
		} else {	
			filters = filters+'&deleted=false';
		}

		axios.get(gConf.apiHost+'/lotteries/private?page=1&limit=10&search='+this.state.search+filters, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.setState({
					'lotteriesList' : res.data.data[0],
					'lotteriesListPages' : res.data.data[1]
				});
			}
		});
	}

	render(){
		let language = this.context;

		let lotteriesList = this.state.lotteriesList.map((lotteries) => 

			<div key={lotteries.id} className="row lottery-DashboardLotteriesList-list-item">
				<div className="col-md-1 ">{lotteries.id}</div>
				<div className="col-md-2">{lotteries.lottery_day}</div>
				<div className="col-md-3">{lotteries.title}</div>
				<div className="col-md-3">
					{lotteries.result !== null ? (
						<span className="badge badge-success p-2">{JSON.parse(lotteries.result).numbers.join(', ')}</span>
					) : (
						lotteries.deleted === 0 ? (
							<span className="badge badge-info p-2" title="Lottery day">Aguardando</span>
						) : (
							<span className="badge badge-danger p-2">Deleted</span>
						)
					)}
				</div>
				<div className="col-md-3">
					<Link to="#" data-toggle="modal" data-target="#modalLotteryTickets" title="All tickets" onClick={() => {this.setLotteryIdByTicketClick(lotteries.id)}}>
						<i className="fas fa-list"></i>
					</Link>

					<Link to="#" data-toggle="modal" data-target="#modalLotteryResult" title="Click to set lottery result" onClick={() => {this.setLotteryId(lotteries.id)}}>
						<i className="fas fa-pencil-alt"></i>
					</Link>

					{lotteries.deleted === 0 ? (
						<React.Fragment>
							<Link to="#" data-toggle="modal" data-target="#modalLottery" title="Click to edit lottery" onClick={() => {this.setTypeModal('edit', lotteries.id)}}><i className="far fa-edit"></i></Link>

							<Link to="#" onClick={lotteries.blocked === 0 ? () => {this.block(lotteries.id)} : () => {this.unBlock(lotteries.id)}} title={lotteries.blocked === 0 ? 'Click to block lottery' : 'Click to umblock lottery'}>
								{lotteries.blocked === 0 ? (
									<i className="far fa-eye-slash"></i>
								) : (
									<i className="far fa-eye"></i>
								)}
							</Link>
						</React.Fragment>
					) : ('')}
					
					<Link to="#" title={lotteries.deleted === 0 ? 'Click to delete lottery' : 'Click to restore lottery'} onClick={lotteries.deleted === 0 ? () => {this.delete(lotteries.id)} : () => {this.restore(lotteries.id)}}>
						{lotteries.deleted === 0 ? (
							<i className="far fa-trash-alt"></i>
						) : (
							<i className="far fa-window-restore"></i>
						)}						
					</Link>
				</div>
			</div>
		);

		return(
			

			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel} page={this.state.page}/>

				{/* /section */}
				<section className="lottery-DashboardLotteriesList">
					
					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">
					
							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white lottery-DashboardLotteriesList-box">
									<BreadCrumbs titulo={language.page_dashboard_lotteries} type="compact" home="/dashboard"/>

									<div className="lottery-DashboardLotteriesList-search">
										<div className="input-group">
									 		<input type="text" className="form-control" placeholder="O que você procura" onChange={this.setSearch} value={this.state.search}/>
								 			<div className="input-group-append">
											    <button type="button" className="lottery-DashboardLotteriesList-bt-search lottery-bg-blue" onClick={this.getLotteries}>Buscar</button>
								  			</div>
										</div>

										<div className="lottery-DashboardLotteriesList-filters">
								  			<div className="row">
									  			<div className="col-md-8">
										  			<label>Filtros: </label>

												    <input type="checkbox" name="filter_blocked" id="filter_blocked" checked={this.state.blocked} onChange={this.setBlocked}/>
												    <label htmlFor="filter_blocked">Blocked</label>

												    <input type="checkbox" name="filter_deleted" id="filter_deleted" checked={this.state.deleted} onChange={this.setDeleted}/>
												    <label htmlFor="filter_deleted">Deleted</label>
											    </div>

											    <div className="col-md-4 lottery-DashboardLotteriesList-menu">
													<Link to="#" data-toggle="modal" data-target="#modalLottery" onClick={() => {this.setTypeModal('create')}}><i className="fas fa-plus"></i> Nova Loteria</Link>
												</div>
											</div>
									  	</div>
									</div>

									{/** /modal **/}
									<div className="modal fade" id="modalLottery" tabIndex="-1" role="dialog" aria-labelledby="modalLottery" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="modalLottery">{this.state.typeModal === 'create' ? 'Nova loteria' : 'Editar loteria'}</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body">
							      					<DashboardLotteries type={this.state.typeModal} lottery_id={this.state.lottery_id} ref={this.refDashboardLotteries}/>
								      			</div>
									      		
										     	<div className="modal-footer">
											        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Cancelar</button>
											        <button type="button" className="btn btn-sm btn-primary" onClick={this.state.typeModal === 'create' ? this.create : this.update}>Salvar</button>
									     		</div>
										    </div>
								  		</div>
									</div>{/** ./modal **/}

									{/** /modal **/}
									<div className="modal fade" id="modalLotteryResult" tabIndex="-1" role="dialog" aria-labelledby="modalLotteryResult" aria-hidden="true">
								  		<div className="modal-dialog" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="modalLotteryResult">Resultado</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body">
							      					<DashboardLotteriesResult lottery_id={this.state.lottery_id} action={this.getLotteries} ref={this.refDashboardLotteriesResult}/>
								      			</div>
									      		
										     	<div className="modal-footer">
											        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Cancelar</button>
											        <button type="button" className="btn btn-sm btn-primary" onClick={this.saveResult}>Salvar</button>
									     		</div>
										    </div>
								  		</div>
									</div>{/** ./modal **/}

									{/** /modal **/}
									<div className="modal fade" id="modalLotteryTickets" tabIndex="-1" role="dialog" aria-labelledby="modalLotteryTickets" aria-hidden="true">
								  		<div className="modal-dialog modal-lg" role="document">
										    <div className="modal-content">
									      		<div className="modal-header">
											        <h5 className="modal-title" id="modalLotteryTickets">Bilhetes</h5>
											        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
										          		<span aria-hidden="true">&times;</span>
											        </button>
									      		</div>
									      		
								      			<div className="modal-body">
							      					<DashboardTicketsReportList lottery_id={this.state.lottery_id} count={this.state.count}/>
								      			</div>
									      		
										     	<div className="modal-footer">
											        <button type="button" className="btn btn-sm btn-danger" data-dismiss="modal">Fechar</button>
									     		</div>
										    </div>
								  		</div>
									</div>{/** ./modal **/}

									<div className="lottery-DashboardLotteriesList-list-box">
										<div className="container">
											<div className="lottery-DashboardLotteriesList-list-title">
												<div className="row lottery-DashboardLotteriesList-list-item">
													<div className="col-md-1">#</div>
													<div className="col-md-2">Lottery</div>
													<div className="col-md-3">Title</div>
													<div className="col-md-3">Status</div>
													<div className="col-md-3">Acoes</div>
												</div>
											</div>

											<div className="lottery-DashboardLotteriesList-list">
												{lotteriesList.length > 0 ? lotteriesList : <div className="row lottery-DashboardLotteriesList-list-item"><div className="col-md-12 text-center lottery-bg-color-gray">Nenhum resultado</div></div>}
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

DashboardLotteriesList.contextType = LanguageContext;

export default DashboardLotteriesList;