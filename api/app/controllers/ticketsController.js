const helpers = require('../helpers/helpers');

// models
const Tickets = require('../models/Tickets');
const Lotteries = require('../models/Lotteries');
const Users = require('../models/Users');


class ticketsController{
	constructor(){
		this.tickets = new Tickets();
		this.lotteries = new Lotteries();
		this.users = new Users();
	}


	/**
	 * List tickets for a specific user
	 */
	index(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let page = req.query.page;
		let limit = req.query.limit;

		//
		let fields = [];
		if(page === undefined || page === ""){
			fields.push('page');
		}

		if(limit === undefined || limit === ""){
			fields.push('limit');
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		//		
		let fieldsNumber = [];
		if(page !== undefined && page !== ""){
			if(isNaN(parseInt(page)) || parseInt(page) < 0){
				fieldsNumber.push('page');
			}
		}

		if(limit !== undefined && limit !== ""){
			if(isNaN(parseInt(limit)) || parseInt(limit) <= 0){
				fieldsNumber.push('limit');
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fieldsNumber.join(', ')+": this field(s) is not a number or smaller than permitted",
				"data" : null
			}
			return res.send(msg);
		}

		// filters
		let filters = new Object();

		let filter_user_id = req.query.user_id;
		let filter_lottery_id = req.query.lottery_id;

		if(filter_user_id !== undefined && filter_user_id !== ""){
			if(!isNaN(parseInt(filter_user_id)) || parseInt(filter_user_id) > 0){
				filters.user_id = parseInt(filter_user_id);
			}
		}

		if(userLoggedLevel === 2){
			if(filter_lottery_id !== undefined && filter_lottery_id !== ""){
				if(!isNaN(parseInt(filter_lottery_id)) || parseInt(filter_lottery_id) > 0){
					filters.lottery_id = parseInt(filter_lottery_id);
				}
			}
		}

		if(userLoggedLevel === 1 && filters.user_id !== userLoggedId){
			let msg = {
				"msgType" : 1,
				"response" : "You not have permission for this",
				"data" : null
			}

			return res.status(400).send(msg);
		}		
		
		this.tickets.list(parseInt(page), parseInt(limit), filters).then(
			(result) => {
				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : result
				}
				return res.send(msg);
			} , 

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - INDEX:ERR001",
					"data" : null
				}

				return res.status(400).send(msg);
			}
		);
	}


	/**
	 *
	 */
	numbersBetCreateJson(numbers_bet, choice_numbers){
		numbers_bet = numbers_bet.split(", ");
		numbers_bet.sort(function(a, b){return a-b});
		choice_numbers = parseInt(choice_numbers);
		
		if(isNaN(choice_numbers)){
			return false;
		}

		var arr = [];
		for(var i = 0; i < numbers_bet.length; i++){
			let number_parse = parseInt(numbers_bet[i]);
			if(isNaN(number_parse)){
				return false;
			}
			arr.push(number_parse);
		}

		if(arr.length === choice_numbers){
			return {"numbers" : arr};
		} else {
			return false;
		}
	}

	/**
	 *
	 */
	create(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let lottery_id = req.body.lottery_id;
		let numbers_bet = req.body.numbers_bet;
		let qt_tickets = req.body.qt_tickets;
		let ticket_price = req.body.ticket_price;
		let choice_numbers = req.body.choice_numbers;

		let fields = [];
		if(lottery_id === undefined || lottery_id === ""){
			fields.push("lottery_id");
		}

		if(numbers_bet === undefined || numbers_bet === ""){
			fields.push("numbers_bet");
		}

		if(qt_tickets === undefined || qt_tickets === ""){
			fields.push("qt_tickets");
		}

		if(ticket_price === undefined || ticket_price === ""){
			fields.push("ticket_price");
		}

		if(choice_numbers === undefined || choice_numbers === ""){
			fields.push("choice_numbers");
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		let fieldsNumber = [];
		if(lottery_id !== undefined && lottery_id !== ""){
			if(isNaN(parseInt(lottery_id)) || parseInt(lottery_id) <= 0){
				fieldsNumber.push("lottery_id");
			}
		}

		if(qt_tickets !== undefined && qt_tickets !== ""){
			if(isNaN(parseInt(qt_tickets)) || parseInt(qt_tickets) <= 0){
				fieldsNumber.push("qt_tickets");
			}
		}

		if(choice_numbers !== undefined && choice_numbers !== ""){
			if(isNaN(parseInt(choice_numbers)) || parseInt(choice_numbers) <= 0){
				fieldsNumber.push("choice_numbers");
			}
		}

		if(ticket_price !== undefined && ticket_price !== ""){
			if(isNaN(parseInt(ticket_price)) || parseInt(ticket_price) <= 0){
				fieldsNumber.push("ticket_price");
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fieldsNumber.join(', ')+": this field(s) is not a number or smaller than permitted",
				"data" : null
			}
			return res.send(msg);
		}

		if(numbers_bet !== undefined && numbers_bet !== ""){
			let check = this.numbersBetCreateJson(numbers_bet, choice_numbers);
			if(check === false){
				let msg = {
					"msgType" : 1,
					"response" : "numbers_bet and choice_numbers: needs to work together",
					"data" : null
				}
				return res.send(msg);
			}
		}

		
		this.lotteries.get(parseInt(lottery_id)).then( // check if lottery exists and if is null
			(response) => {
				if(response.length === 1){
					if(response[0].result === null){
						
						this.users.balance(userLoggedId).then(
							(result) => {
								if(result.length !== 0){
									let resultData = result[0];
									let deposits = 0;
									let withdrawal = 0;
									let tickets = 0;
									let balance = 0;

									if(resultData.deposits_sum !== null){
										deposits = resultData.deposits_sum;
									}
									if(resultData.withdrawal_sum !== null){
										withdrawal = resultData.withdrawal_sum;
									}
									if(resultData.tickets_sum !== null){
										tickets = resultData.tickets_sum;
									}

									balance = ((deposits - withdrawal) - tickets);

									if((ticket_price * qt_tickets) > balance){
										let msg = {
											"msgType" : 1,
											"response" : "Insuficient balance",
											"data" : null
										}
										return res.send(msg);
									} 

									let data = {
										'user_id' : userLoggedId,
										'dt_created' : helpers.timestamp(),
										'canceled' : 0,
										'lottery_id' : parseInt(lottery_id),
										'numbers_bet' : JSON.stringify(this.numbersBetCreateJson(numbers_bet, choice_numbers)),
										'qt_tickets' : parseInt(qt_tickets),
										'ticket_price' : parseInt(ticket_price)
									}

									this.tickets.create(data).then(
										(result) => {
											if(result.affectedRows === 1){
												let msg = {
													"msgType" : 2,
													"response" : "Lottery created",
													"data" : result.insertId
												}
												return res.send(msg);
											}
										},

										(err) => {
											let msg = {
												"msgType" : 0,
												"response" : "An error occurred - CREATE:ERR001",
												"data" : null
											}

											return res.status(400).send(msg);
										}
									);
								} else {
									let msg = {
										"msgType" : 1,
										"response" : "User balance not found",
										"data" : null
									}
									return res.send(msg);
								}
							},

							(err) => {
								let msg = {
									"msgType" : 0,
									"response" : "An error occurred - CREATE:ERR002",
									"data" : null
								}

								return res.status(400).send(msg);
							}
						);

					} else {
						let msg = {
							"msgType" : 1,
							"response" : "Lottery is closed.",
							"data" : null
						}
						return res.send(msg);
					}
				} else {
					return false;
				}
			},
			(err) => {
				
			}
		);
		
	}
}

module.exports = ticketsController;