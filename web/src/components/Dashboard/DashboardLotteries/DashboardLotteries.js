import React, { Component } from 'react';

import axios from 'axios';

import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './DashboardLotteries.css';

class DashboardLotteries extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,
			'type' : null,
			'alert' : 0,
			'alertMsg' : [],

			'lottery_id' : null,
			'title' : '',
			'description' : '',
			'numbers_count' : '',
			'choice_numbers' : '',
			'lottery_day' : '',
			'percent_lottery' : '',
			'percent_house' : '',
			'ticket_price' : '',
			'default_prize' : '',

			'isvalid_title' : '',
			'isvalid_description' : '',
			'isvalid_numbers_count' : '',
			'isvalid_percent_house' : '',
			'isvalid_percent_lottery' : '',
			'isvalid_choice_numbers' : '',
			'isvalid_default_prize' : '',
			'isvalid_ticket_price' : '',
			'isvalid_lottery_day' : ''
		};

		this.setTitle = this.setTitle.bind(this);
		this.setDescription = this.setDescription.bind(this);
		this.setNumbersCount = this.setNumbersCount.bind(this);
		this.setNumbersWin = this.setNumbersWin.bind(this);
		this.setLotteryDay = this.setLotteryDay.bind(this);
		this.setPercentLottery = this.setPercentLottery.bind(this);
		this.setPercentHouse = this.setPercentHouse.bind(this);
		this.setTicketPrice = this.setTicketPrice.bind(this);
		this.setDefaultPrize = this.setDefaultPrize.bind(this);

		this.alert = this.alert.bind(this);
		this.create = this.create.bind(this);

		this.getLottery = this.getLottery.bind(this);
		this.validateFields = this.validateFields.bind(this);
		this.resetForm = this.resetForm.bind(this);
	}

	componentDidMount(){
		
	}
	
	componentDidUpdate(prevProps){
		let type = this.props.type !== undefined ? this.props.type : null;
		let lottery_id = this.props.lottery_id !== undefined ? this.props.lottery_id : null;

		if(prevProps.type !== type || prevProps.lottery_id !== lottery_id){
			if(type === 'create' && lottery_id === null){
				// clear state if is a create window
				this.setState({
					'lottery_id' : null
				});
				this.resetForm();
			} else if(type === 'edit' && lottery_id !== null){
				this.getLottery(lottery_id);
				this.resetForm();
			}

			this.setState({
				'type' : type
			});
		}
	}

	setTitle(event){
		let title = event.target.value;
		this.setState({
			'title' : title
		});
	}

	setDescription(event){
		let description = event.target.value;
		this.setState({
			'description' : description
		});
	}

	setNumbersCount(event){
		let numbers_count = event.target.value;
		this.setState({
			'numbers_count' : numbers_count
		});
	}

	setNumbersWin(event){
		let choice_numbers = event.target.value;
		this.setState({
			'choice_numbers' : choice_numbers
		});
	}

	setLotteryDay(event){
		let lottery_day = event.target.value;
		this.setState({
			'lottery_day' : lottery_day
		});
	}

	setPercentLottery(event){
		let percent_lottery = event.target.value;
		this.setState({
			'percent_lottery' : percent_lottery
		});
	}

	setPercentHouse(event){
		let percent_house = event.target.value;
		this.setState({
			'percent_house' : percent_house
		});
	}

	setTicketPrice(event){
		let ticket_price = event.target.value;
		this.setState({
			'ticket_price' : ticket_price
		});
	}

	setDefaultPrize(event){
		let default_prize = event.target.value;
		this.setState({
			'default_prize' : default_prize
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

		if(this.state.title === ""){
			this.setState({
				'isvalid_title' : ' is-invalid'
			});
			fields.push('title');
		} else {
			this.setState({
				'isvalid_title' : ' is-valid'
			});
		}

		if(this.state.description === ""){
			this.setState({
				'isvalid_description' : ' is-invalid'
			});
			fields.push('description');
		} else {
			this.setState({
				'isvalid_description' : ' is-valid'
			});
		}

		if(this.state.numbers_count === ""){
			this.setState({
				'isvalid_numbers_count' : ' is-invalid'
			});
			fields.push('numbers_count');
		} else {
			this.setState({
				'isvalid_numbers_count' : ' is-valid'
			});
		}

		if(this.state.percent_house === ""){
			this.setState({
				'isvalid_percent_house' : ' is-invalid'
			});
			fields.push('percent_house');
		} else {
			this.setState({
				'isvalid_percent_house' : ' is-valid'
			});
		}

		if(this.state.percent_lottery === ""){
			this.setState({
				'isvalid_percent_lottery' : ' is-invalid'
			});
			fields.push('percent_lottery');
		} else {
			this.setState({
				'isvalid_percent_lottery' : ' is-valid'
			});
		}

		if(this.state.choice_numbers === ""){
			this.setState({
				'isvalid_choice_numbers' : ' is-invalid'
			});
			fields.push('choice_numbers');
		} else {
			this.setState({
				'isvalid_choice_numbers' : ' is-valid'
			});
		}

		if(this.state.default_prize === ""){
			this.setState({
				'isvalid_default_prize' : ' is-invalid'
			});
			fields.push('default_prize');
		} else {
			this.setState({
				'isvalid_default_prize' : ' is-valid'
			});
		}

		if(this.state.ticket_price === ""){
			this.setState({
				'isvalid_ticket_price' : ' is-invalid'
			});
			fields.push('ticket_price');
		} else {
			this.setState({
				'isvalid_ticket_price' : ' is-valid'
			});
		}

		if(this.state.lottery_day === ""){
			this.setState({
				'isvalid_lottery_day' : ' is-invalid'
			});
			fields.push('lottery_day');
		} else {
			this.setState({
				'isvalid_lottery_day' : ' is-valid'
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
			'title' : '',
			'description' : '',
			'numbers_count' : '',
			'choice_numbers' : '',
			'lottery_day' : '',
			'percent_lottery' : '',
			'percent_house' : '',
			'ticket_price' : '',
			'default_prize' : '',

			'isvalid_title' : '',
			'isvalid_description' : '',
			'isvalid_numbers_count' : '',
			'isvalid_percent_house' : '',
			'isvalid_percent_lottery' : '',
			'isvalid_choice_numbers' : '',
			'isvalid_default_prize' : '',
			'isvalid_ticket_price' : '',
			'isvalid_lottery_day' : ''
		});
	}

	create(){
		let validate = this.validateFields();
		if(!validate){
			return false;
		}

		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let data = {
			'title' : this.state.title,
			'description' : this.state.description,
			'numbers_count' : this.state.numbers_count,
			'choice_numbers' : this.state.choice_numbers,
			'lottery_day' : this.state.lottery_day,
			'percent_lottery' : this.state.percent_lottery,
			'percent_house' : this.state.percent_house,
			'ticket_price' : this.state.ticket_price,
			'default_prize' : this.state.default_prize
		}

		axios.post(gConf.apiHost+'/lotteries', data, {headers : headers}).then(
			res => {
				if(res.data.msgType === 1){
					
					if(res.data.data !== null){
						if(res.data.data.field !== undefined && res.data.data.field === 'lottery_day'){
							this.setState({
								'isvalid_lottery_day' : ' is-invalid'
							});
						}
					}

					//
					this.alert(res.data.response, 'warning');
				} else if(res.data.msgType === 2){
					//
					this.alert(res.data.response, 'success');
					this.resetForm();
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

	update(){
		let validate = this.validateFields();
		if(!validate){
			return false;
		}

		let token = localStorage.getItem('token');

		let headers = {
			'Authorization' : token
		}

		let data = {
			'title' : this.state.title,
			'description' : this.state.description,
			'numbers_count' : this.state.numbers_count,
			'choice_numbers' : this.state.choice_numbers,
			'lottery_day' : this.state.lottery_day,
			'percent_lottery' : this.state.percent_lottery,
			'percent_house' : this.state.percent_house,
			'ticket_price' : this.state.ticket_price,
			'default_prize' : this.state.default_prize
		}

		axios.put(gConf.apiHost+'/lotteries/'+this.state.lottery_id, data, {headers : headers}).then(
			res => {
				if(res.data.msgType === 1){

					if(res.data.data !== null){
						if(res.data.data.field !== undefined && res.data.data.field === 'lottery_day'){
							this.setState({
								'isvalid_lottery_day' : ' is-invalid'
							});
						}
					}
					
					//
					this.alert(res.data.response, 'warning');
				} else if(res.data.msgType === 2){
					//
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

	getLottery(lottery_id){
		let token = localStorage.getItem('token');
		
		let headers = {
			'Authorization' : token
		}

		axios.get(gConf.apiHost+'/lotteries/private/'+lottery_id, {headers : headers}).then(res => {
			if(res.data.msgType === 2){
				this.setState({
					'lottery_id' : res.data.data[0].id,
					'title' : res.data.data[0].title,
					'description' : res.data.data[0].description,
					'numbers_count' : res.data.data[0].numbers_count,
					'choice_numbers' : res.data.data[0].choice_numbers,
					'lottery_day' : res.data.data[0].lottery_day,
					'percent_lottery' : res.data.data[0].percent_lottery,
					'percent_house' : res.data.data[0].percent_house,
					'ticket_price' : (res.data.data[0].ticket_price / 1e8).toFixed(8),
					'default_prize' : (res.data.data[0].default_prize / 1e8).toFixed(8)
				});
			}
		});
	}

	render(){
		return(
			<React.Fragment>
				<div className="lottery-DashboardLotteries-alert">
					{this.state.alertMsg.map(alertMsg => alertMsg.msg)}
				</div>

				{/* /section */}
				<section className="lottery-DashboardLotteries">

					{/* /container */}
					<div className="container">

						{/* /row */}
						<div className="row">

							{/* /col */}
							<div className="col-md-12">
								<div className="lottery-DashboardLotteries-form">
									<div className="form-row">
										<div className="form-group col-md-12">
								      		<label htmlFor="title">Titulo</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_title} name="title" id="title" placeholder="Titulo" onChange={this.setTitle} value={this.state.title}/>
									    </div>

									    <div className="form-group col-md-12">
								      		<label htmlFor="description">Descrição</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_description} name="description" id="description" placeholder="Descrição" onChange={this.setDescription} value={this.state.description}/>
									    </div>
									</div>

									<div className="form-row">
										<div className="form-group col-md-4">
								      		<label htmlFor="numbers_count">Números</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_numbers_count} name="numbers_count" id="numbers_count" placeholder="Ex: 1-50" onChange={this.setNumbersCount} value={this.state.numbers_count}/>
									    </div>

									    <div className="form-group col-md-4">
								      		<label htmlFor="percent_house">% da casa</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_percent_house} name="percent_house" id="percent_house" placeholder="Ex: 10.00%" onChange={this.setPercentHouse} value={this.state.percent_house}/>
									    </div>

									    <div className="form-group col-md-4">
								      		<label htmlFor="percent_lottery">% da loteria</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_percent_lottery} name="percent_lottery" id="percent_lottery" placeholder="Ex: 90.00%" onChange={this.setPercentLottery} value={this.state.percent_lottery}/>
									    </div>
									</div>

									<div className="form-row">
										<div className="form-group col-md-4">
								      		<label htmlFor="choice_numbers">Números para vencer</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_choice_numbers} name="choice_numbers" id="choice_numbers" placeholder="Ex: 6 números" onChange={this.setNumbersWin} value={this.state.choice_numbers}/>
									    </div>

									    <div className="form-group col-md-4">
								      		<label htmlFor="default_prize">Prêmio padrão</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_default_prize} name="default_prize" id="default_prize" placeholder="Ex: 0.10000000" onChange={this.setDefaultPrize} value={this.state.default_prize}/>
									    </div>

									    <div className="form-group col-md-4">
								      		<label htmlFor="ticket_price">Valor do bilhete</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_ticket_price} name="ticket_price" id="ticket_price" placeholder="Ex: 0.00010000" onChange={this.setTicketPrice} value={this.state.ticket_price}/>
									    </div>
									</div>

									<div className="form-row">
										<div className="form-group col-md-6">
								      		<label htmlFor="lottery_day">Data do sorteio</label>
									    	<input type="text" className={'form-control' + this.state.isvalid_lottery_day} name={'lottery_day' + this.state.isvalid_lottery_day} id="lottery_day" placeholder="00/00/0000 10:00" onChange={this.setLotteryDay} value={this.state.lottery_day}/>
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

export default DashboardLotteries;