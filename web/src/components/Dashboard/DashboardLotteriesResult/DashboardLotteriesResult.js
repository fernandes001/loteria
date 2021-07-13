import React, { Component } from 'react';

import axios from 'axios';

import gConf from '../../../config/global.json';
import Alert from '../../Alert/Alert';

import './DashboardLotteriesResult.css';

class DashboardLotteriesResult extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null,

			'alert' : 0,
			'alertMsg' : [],

			'numbers' : [],
		};

		this.setNumbers = this.setNumbers.bind(this);
		this.checkNumbers = this.checkNumbers.bind(this);
	}

	componentDidMount(){
		
	}
	
	componentDidUpdate(prevProps){}

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

	setNumbers(event){
		let numbers = event.target.value;

		this.setState({
			'numbers' : numbers
		});
	}

	update(){
		let numbers = this.state.numbers;

		if(numbers.length === 0){
			this.alert('Invalid result', 'warning');
			return false;
		}

		numbers = numbers.split(',');
		let check = this.checkNumbers(numbers);

		if(check === false){
			this.alert('Invalid result', 'warning');
			return false;
		}

		let token = localStorage.getItem('token');
		let headers = {
			'Authorization' : token
		}

		let data = {
			'result' : '{"numbers": ['+numbers+']}'
		}

		let lottery_id = this.props.lottery_id !== undefined ? this.props.lottery_id : null;

		axios.put(gConf.apiHost+'/lotteries/'+lottery_id, data, {headers : headers}).then(
			res => {
				if(res.data.msgType === 1){
					//
					this.alert(res.data.response, 'warning');
				} else if(res.data.msgType === 2){
					//
					this.alert(res.data.response, 'success');
					this.props.action();
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

	checkNumbers(numbers){
		for(let i = 0; i < numbers.length; i++){
			if(isNaN(numbers[i])){
				return false;
			}
		}
		return true;
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
								      		<label htmlFor="result">Resultado (separe por virgula)</label>
									    	<input type="text" className={'form-control'} name="result" id="result" placeholder="Ex: 1,2,3..." onChange={this.setNumbers} value={this.state.numbers}/>
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

export default DashboardLotteriesResult;