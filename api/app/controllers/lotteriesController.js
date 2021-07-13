const helpers = require('../helpers/helpers');

// models
const Lotteries = require('../models/Lotteries');
const Tickets = require('../models/Tickets');


class lotteriesController{
	constructor(){
		this.lotteries = new Lotteries();
		this.tickets = new Tickets();
	}


	/**
	 *
	 */
	index(req, res, type){
		if(type === 'private'){
			let userLoggedId = parseInt(req.userId);
			let userLoggedLevel = parseInt(req.userLevel);

			if(userLoggedLevel === 1){
				let msg = {
					"msgType" : 0,
					"response" : "You not have permission for this",
					"data" : null
				}
				return res.status(401).send(msg);
			}
		}

		let page = req.query.page;
		let limit = req.query.limit;
		let search = req.query.search;

		//
		let fields = [];
		if(page === undefined || page === ""){
			fields.push('page');
		}

		if(limit === undefined || limit === ""){
			fields.push('limit');
		}

		if(search === undefined){
			fields.push("search");
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

		let filter_blocked = req.query.blocked;
		let filter_deleted = req.query.deleted;
		let filter_result =	req.query.result;

		if(filter_blocked === 'true'){
			filters.blocked = 1;
		} else if(filter_blocked === 'false') {
			filters.blocked = 0;
		}

		if(filter_deleted === 'true'){
			filters.deleted = 1;
		} else if(filter_deleted === 'false') {
			filters.deleted = 0;
		}

		if(filter_result === 'true'){
			filters.result = true;
		} else if(filter_result === 'false'){
			filters.result = false;
		}

		this.lotteries.list(parseInt(page), parseInt(limit), search, type, filters).then(
			(result) => {
				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : result
				}
				return res.send(msg);
			}, 

			(err) => {
				console.log(err);
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - LIST:ERR001",
					"data" : null
				}
				return res.status(400).send(msg);
			}
		);
	}


	/**
	 * Create a new lottery schema
	 */
	create(req, res){
		// validate access level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		if(userLoggedLevel !== 2){
			let msg = {
				"msgType" : 1,
				"response" : "You not have permission for this",
				"data" : null
			}

			return res.status(400).send(msg);
		}

		let timestamp = helpers.timestamp();
		let fields = [];
		
		let title = req.body.title;
		let description = req.body.description;
		let numbers_count = req.body.numbers_count;
		let choice_numbers = req.body.choice_numbers;  
		let lottery_day = req.body.lottery_day;
		let percent_lottery = req.body.percent_lottery;
		let percent_house = req.body.percent_house;
		let ticket_price = req.body.ticket_price;
		let default_prize = req.body.default_prize;

		if(title === undefined || title === ""){
			fields.push('title');
		}

		if(numbers_count === undefined || numbers_count === ""){
			fields.push('numbers_count');
		}

		if(choice_numbers === undefined || choice_numbers === ""){
			fields.push('choice_numbers');
		}

		if(lottery_day === undefined || lottery_day === ""){
			fields.push('lottery_day');
		}

		if(percent_lottery === undefined || percent_lottery === ""){
			fields.push('percent_lottery');
		}

		if(ticket_price === undefined || ticket_price === ""){
			fields.push('ticket_price');
		}

		if(percent_house === undefined || percent_house === ""){
			fields.push('percent_house');
		}
		
		if(default_prize === undefined || default_prize === ""){
			fields.push("default_prize");
		}

		// check if all required fields are fill
		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(', ')+": is required",
				"data" : {
					"fields" : fields
				}
			}
			return res.send(msg);
		}

		// mount data array
		let data = {
			"user_id" : userLoggedId,
			"dt_created" : timestamp,
			"blocked" : 0,
			"deleted" : 0
		}; // default fields

		if(title !== undefined && title !== ""){
			data.title = title;
		}

		if(description !== undefined && description !== ""){
			data.description = description;
		}

		if(numbers_count !== undefined && numbers_count !== ""){
			data.numbers_count = numbers_count;
		}

		if(choice_numbers !== undefined && choice_numbers !== ""){
			data.choice_numbers = choice_numbers;
		}

		if(lottery_day !== undefined && lottery_day !== ""){
			if(helpers.timestamp(lottery_day) === false){
				let msg = {
					"msgType" : 1,
					"response" : "Invalid date format",
					"data" : {
						"field" : 'lottery_day'
					}
				}
				return res.send(msg);
			}
			data.lottery_day = helpers.timestamp(lottery_day);
		}

		if(percent_lottery !== undefined && percent_lottery !== ""){
			data.percent_lottery = percent_lottery;
		}

		if(percent_house !== undefined && percent_house !== ""){
			data.percent_house = percent_house;
		}

		if(ticket_price !== undefined && ticket_price !== ""){
			let ticket_price_converted = (ticket_price * 1e8).toFixed(0);

			if(parseInt(ticket_price_converted) === 0){
				let msg = {
					"msgType" : 1,
					"response" : 'ticket_price: value needs greater than zero',
					"data" : null
				}
				return res.send(msg);
			}

			data.ticket_price = ticket_price_converted;
		}

		if(default_prize !== undefined && default_prize !== ""){
			let default_prize_converted = (default_prize * 1e8).toFixed(0);

			if(parseInt(default_prize_converted) === 0){
				let msg = {
					"msgType" : 1,
					"response" : 'default_prize: value needs greater than zero',
					"data" : null
				}
				return res.send(msg);
			}

			data.default_prize = default_prize_converted;
		}

		console.log('data: ', data);

		this.lotteries.create(data).then(
			(result) => {
				let msg = {
					"msgType" : 2,
					"response" : 'Lottery has been created',
					"data" : {
						"insertId" : result.insertId
					}
				}
				return res.send(msg);
			}, 

			(err) => {
				console.log(err);
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - CREATE:ERR001",
					"data" : null
				}
				return res.status(400).send(msg);
			}
		);

	}


	/**
	 *
	 */
	get(req, res){
		var id = parseInt(req.params.id);

		if(id < 0){
			let msg = {
				"msgType" : 1,
				"response" : "Lottery id invalid",
				"data" : null
			}
			return res.send(msg);
		}

		if(isNaN(id)){
			let msg = {
				"msgType" : 1,
				"response" : "Lottery id is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		this.lotteries.get(id).then(
			(result) => {
				if(result.length > 0){
					let msg = {
						"msgType" : 2,
						"response" : null,
						"data" : result
					}
					res.send(msg);
				} else {
					let msg = {
						"msgType" : 1,
						"response" : "Lottery not found",
						"data" : null
					}
					res.send(msg);
				}
			},

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - GET:ERR001",
					"data" : null
				}
				res.status(400).send(msg);
			} 
		);
	}


	/**
	 *
	 */
	update(req, res){
		// Check user permission level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		if(userLoggedLevel !== 2){
			let msg = {
				"msgType" : 0,
				"response" : "You not have permission for this",
				"data" : null
			}
			return res.status(401).send(msg);
		}

		let id = req.params.id;
		let title = req.body.title;
		let description = req.body.description;
		let numbers_count = req.body.numbers_count;
		let percent_house = req.body.percent_house;
		let percent_lottery = req.body.percent_lottery;
		let choice_numbers = req.body.choice_numbers;
		let default_prize = req.body.default_prize;
		let ticket_price = req.body.ticket_price;
		let lottery_day = req.body.lottery_day;
		let deleted = req.body.deleted;
		let blocked = req.body.blocked;
		let result = req.body.result;

		let data = {};

		//
		let fields = [];
		if(id === undefined || id === ""){
			fields.push('id');
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
		if(isNaN(parseInt(id)) || parseInt(id) <= 0){ // default
			fieldsNumber.push('id');
		} else {
			data.id = parseInt(id);
		}
	
		if(percent_house !== undefined && percent_house !== ""){ // optional
			if(isNaN(parseFloat(percent_house)) || parseFloat(percent_house) <= 0){
				fieldsNumber.push('percent_house');
			} else {
				data.percent_house = parseFloat(percent_house);
			}
		}

		if(percent_lottery !== undefined && percent_lottery !== ""){ // optional
			if(isNaN(parseFloat(percent_lottery)) || parseFloat(percent_lottery) <= 0){
				fieldsNumber.push('percent_lottery');
			} else {
				data.percent_lottery = parseFloat(percent_lottery);
			}
		}

		if(choice_numbers !== undefined && choice_numbers !== ""){ // optional
			if(isNaN(parseInt(choice_numbers)) || parseInt(choice_numbers) <= 0){
				fieldsNumber.push('choice_numbers');
			} else {
				data.choice_numbers = parseInt(choice_numbers);
			}
		}

		if(default_prize !== undefined && default_prize !== ""){ // optional
			let default_prize_converted = (default_prize * 1e8).toFixed(0);

			if(isNaN(parseInt(default_prize_converted)) || parseInt(default_prize_converted) <= 0){
				fieldsNumber.push('default_prize');
			} else {
				data.default_prize = parseFloat(default_prize_converted);
			}
		}

		if(ticket_price !== undefined && ticket_price !== ""){ // optional
			let ticket_price_converted = (ticket_price * 1e8).toFixed(0);

			if(isNaN(parseInt(ticket_price_converted)) || parseInt(ticket_price_converted) <= 0){
				fieldsNumber.push('ticket_price');
			} else {
				data.ticket_price = parseFloat(ticket_price_converted);
			}
		}

		if(blocked !== undefined && blocked !== ""){ // optional
			if(isNaN(parseInt(blocked)) || parseInt(blocked) < 0){
				fieldsNumber.push('blocked');
			} else {
				data.blocked = parseInt(blocked);
			}
		}

		if(deleted !== undefined && deleted !== ""){ // optional
			if(isNaN(parseInt(deleted)) || parseInt(deleted) < 0){
				fieldsNumber.push('deleted');
			} else {
				data.deleted = parseInt(deleted);
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fieldsNumber.join(', ')+": this field(s) is not a number or smaller/bigger than permitted",
				"data" : null
			}
			return res.send(msg);
		}

		if(title !== undefined && title !== ""){
			data.title = title;
		}

		if(description !== undefined && description !== ""){
			data.description = description;
		}		

		if(numbers_count !== undefined && numbers_count !== ""){
			data.numbers_count = numbers_count;
		}

		if(lottery_day !== undefined && lottery_day !== ""){
			if(helpers.timestamp(lottery_day) === false){
				let msg = {
					"msgType" : 1,
					"response" : "Invalid date format",
					"data" : {
						"field" : 'lottery_day'
					}
				}
				return res.send(msg);
			}
			data.lottery_day = helpers.timestamp(lottery_day);
		}

		if(result !== undefined && result !== ""){
			data.result = result;
		}

		// needs one or more optional fields plus the default fields
		if(Object.keys(data).length <= 1){
			let msg = {
				"msgType" : 1,
				"response" : "Needs one or more fields for submit",
				"data" : null
			}
			return res.send(msg);
		}

		this.lotteries.update(data).then(
			(result) => {
				if(result.changedRows === 1){
					let msg = {
						"msgType" : 2,
						"response" : "Lottery updated",
						"data" : null
					}
					return res.send(msg);
				} else {
					let msg = {
						"msgType" : 1,
						"response" : "No changes for this lottery",
						"data" : null
					}
					return res.send(msg);
				}
			},
			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred UPDATE:ERR001",
					"data" : null
				}
				return res.status(400).send(msg);
			}
		);
	}


	/**
	 *
	 */
	delete(req, res){
		// validate access level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		if(userLoggedLevel === 1){
			let msg = {
				"msgType" : 1,
				"response" : "You not have permission for this",
				"data" : null
			}

			return res.status(400).send(msg);
		}

		var id = parseInt(req.params.id);

		if(id < 0){
			let msg = {
				"msgType" : 1,
				"response" : "Lottery id invalid",
				"data" : null
			}
			return res.send(msg);
		}

		if(isNaN(id)){
			let msg = {
				"msgType" : 1,
				"response" : "Lottery id is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		// check if lottery exists?
		this.lotteries.search("id", id, new Array('id')).then(
			(result) => {
				if(result.length >= 1){
					return true; // lottery exists!
				} else {
					let msg = {
						"msgType" : 1,
						"response" : "Lottery not found",
						"data" : null
					}
					res.send(msg);
					return false;
				}
			}, 

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - DELETE:ERR001",
					"data" : null
				}

				res.status(400).send(msg);
				return false;
			}
		).then((result) => {
			if(result === false){
				return false;
			}

			// check if exists one or more tickets using this lottery
			this.tickets.search("lottery_id", id, new Array('id')).then(
				(result) => {
					if(result.length >= 1){
						let msg = {
							"msgType" : 1,
							"response" : "Lottery has dependency, and not be deleted",
							"data" : null
						}

						res.send(msg);
						return false;
					} else {
						return true;
					}
				}, 

				(err) => {
					let msg = {
						"msgType" : 0,
						"response" : "An error occurred - DELETE:ERR002",
						"data" : null
					}

					res.status(400).send(msg);
					return false;
				}
			).then((result) => {
				if(result === false){
					return false;
				}

				// if lottery don't has dependency
				this.lotteries.softdelete(id).then(
					(result) => {
						if(result.affectedRows === 1){
							let msg = {
								"msgType" : 2,
								"response" : "Lottery deleted",
								"data" : null
							}
							res.send(msg);
						} else {
							let msg = {
								"msgType" : 1,
								"response" : "Lottery has gone",
								"data" : null
							}
							res.send(msg);
						}
					}, 

					(err) => {
						let msg = {
							"msgType" : 0,
							"response" : "An error occurred - DELETE:ERR003",
							"data" : null
						}

						res.status(400).send(msg);
					}
				);
			});
		});
	}
}

module.exports = lotteriesController;







