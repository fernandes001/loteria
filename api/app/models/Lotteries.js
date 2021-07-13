const connection = require('../../config/connection');
const Model = require('./Model');
const table = 'lotteries'; // default table


class Lotteries{
	constructor(){
		this.mD = new Model();
		this.db = new connection();
	}


	/**
	 *
	 */
	list(page, limit, search, type, filters = null){
		// ex: (1 * 10) - 10 = 0 // offset start
		var offset = (page * limit) - limit;
		if(offset < 0){
			offset = 0;
		}

		var fields = [];
		if(type === 'public'){
			fields.push(
				[
					'id', 
					'title', 
					'description', 
					'choice_numbers', 
					"DATE_FORMAT(FROM_UNIXTIME(lottery_day), '%d/%m/%Y %H:%i:%s') as lottery_day", 
					'numbers_count', 
					'ticket_price', 
					'result', 
					'default_prize'
				]
			);
		} else if(type === 'private'){
			fields.push(
				[
					'id', 
					'user_id', 
					'title', 
					'description', 
					'numbers_count', 
					'choice_numbers', 
					"DATE_FORMAT(FROM_UNIXTIME(lottery_day), '%d/%m/%Y %H:%i:%s') as lottery_day", 
					'percent_lottery', 
					'ticket_price', 
					'default_prize', 
					'result', 
					'blocked', 
					'deleted', 
					"DATE_FORMAT(FROM_UNIXTIME(dt_created), '%d/%m/%Y %H:%i:%s') as dt_created"
				]
			);
		}

		let where = [];
		where.push("WHERE (title LIKE "+this.db.connect().escape("%"+search+"%")+')');
		
		if(filters !== null && Object.keys(filters).length > 0){
			
			if(filters.blocked !== undefined){
				where.push("blocked = "+filters.blocked);
			}

			if(filters.deleted !== undefined){
				where.push("deleted = "+filters.deleted);
			}

			if(filters.result !== undefined){
				if(filters.result === true){ // get lotteries with result
					where.push("result is not null");
				} else if(filters.result === false){ // get lotteries without result
					where.push("result is null");
				}
			}

			where = where.join(" AND ");
		}

		// get results
		var p1 = new Promise((resolve, reject) => {
			//var sql = 'SELECT '+fields.join(', ')+' FROM ??'+where+' LIMIT ?,?';
			var sql = 
					`
						SELECT 
						`+fields.join(', ')+`,
						(SELECT COUNT(id) FROM tickets where lottery_id = lo.id) as lottery_number_bet,
						(SELECT CAST(SUM(ticket_price * qt_tickets) * percent_lottery / 100 AS DECIMAL (11, 0)) FROM tickets WHERE lottery_id = lo.id) as lottery_sum,
						UNIX_TIMESTAMP(NOW()) AS unix_timestamp
						FROM ?? AS lo `+where+` LIMIT ?,?
					`;

			var parameters = [
				table,
				offset,
				limit
			];

			sql = this.db.connect().format(sql, parameters);

			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});

		// count all results in database
		var p2 = new Promise((resolve, reject) => {
			var sql = 'SELECT COUNT(id) as total FROM ??'+where;
			var parameters = [
				table
			];
			sql = this.db.connect().format(sql, parameters);

			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}

				var numbersOfPage = 0;
				var current = page;

				// count number of pages
				if(result[0].total % limit === 0){
					numbersOfPage = result[0].total / limit;
				} else {
					numbersOfPage = Math.floor((result[0].total / limit)) + 1;
				}

				var data = {
					"current" : current,
					"numbersOfPage" : numbersOfPage,
					"total" : result[0].total,
				}
				resolve(data);
			});
		});

		return Promise.all([p1, p2]);
	}

	
	/**
	 *
	 */
	search(field, value, getFields){
		return this.mD.search(field, value, table, getFields);
	}


	/**
	 * Create a new lottery schema
	 * @param {integer} - data.user_id[length: 10] - user
	 * @param {string} - data.description[length: 50] - description
	 * @param {string} - data.numbers_count[length: 7] - start-end for define the lottery range
	 * @param {integer} - data.choice_numbers[length: 3] - define which quantity of numbers needs for win
	 * @param {integer} - data.lottery_day[length: 13] - unix time for lottery day
	 * @param {float} - data.percent_lottery[length: 5,2] - amount percent for the lottery day
	 * @param {float} - data.percent_house[length: 5,2] - amount percent for the house
	 * @param {integer} - data.ticket_price[length: 20] - ticket price in BTC
	 * @param {integer} - data.default_prize[length: 20] - default prize in BTC
	 * @param {integer} - data.blocked[length: 1] - lottery status
	 * @param {integar} - data.dt_created[length: 13] - lottery created date
	 * @memberof Igma
	 * @method create
	 */
	create(data){
		var inserts = [
			'user_id',
			'dt_created',
			'blocked',
			'deleted'		
		];

		let values = [
			data.user_id,
			data.dt_created,
			data.blocked,
			data.deleted
		];

		if(data.title !== undefined && data.title !== ""){
			values.push(data.title);
			inserts.push('title');
		}

		if(data.description !== undefined && data.description !== ""){
			values.push(data.description);
			inserts.push('description');
		}

		if(data.numbers_count !== undefined && data.numbers_count !== ""){
			values.push(data.numbers_count);
			inserts.push('numbers_count');
		}

		if(data.choice_numbers !== undefined && data.choice_numbers !== ""){
			values.push(data.choice_numbers);
			inserts.push('choice_numbers');
		}

		if(data.lottery_day !== undefined && data.lottery_day !== ""){
			values.push(data.lottery_day);
			inserts.push('lottery_day');
		}

		if(data.percent_lottery !== undefined && data.percent_lottery !== ""){
			values.push(data.percent_lottery);
			inserts.push('percent_lottery');
		}

		if(data.percent_house !== undefined && data.percent_house !== ""){
			values.push(data.percent_house);
			inserts.push('percent_house');
		}

		if(data.ticket_price !== undefined && data.ticket_price !== ""){
			values.push(data.ticket_price);
			inserts.push('ticket_price');
		}

		if(data.default_prize !== undefined && data.default_prize !== ""){
			values.push(data.default_prize);
			inserts.push('default_prize');
		}

		let sql = "INSERT INTO ?? ("+inserts.join(', ')+") VALUES (?)";

		let parameters = [
			table,
			values
		];

		sql = this.db.connect().format(sql, parameters);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}


	/**
	 *
	 */
	get(id){
		var sql = 
				`
					SELECT 
						id,
						user_id,
						title,
						description,
						numbers_count,
						choice_numbers,
						DATE_FORMAT(FROM_UNIXTIME(lottery_day), '%d/%m/%Y %H:%i:%s') as lottery_day,
						percent_lottery,
						percent_house,
						ticket_price,
						ticket_price,
						default_prize,
						result,
						blocked,
						deleted,
						(SELECT COUNT(id) FROM tickets where lottery_id = lo.id) as lottery_number_bet,
						(SELECT SUM(qt_tickets) FROM tickets where lottery_id = lo.id) as lottery_qt_tickets,
						(SELECT SUM(qt_tickets) FROM tickets where lottery_id = lo.id and numbers_bet = lo.result) as lottery_qt_tickets_win,
						(SELECT SUM(qt_tickets) FROM tickets where lottery_id = lo.id and numbers_bet <> lo.result) as lottery_qt_tickets_lose,
						(SELECT CAST(SUM(ticket_price * qt_tickets) * percent_lottery / 100 AS DECIMAL (11, 0)) FROM tickets WHERE lottery_id = lo.id) as lottery_sum,
						DATE_FORMAT(FROM_UNIXTIME(dt_created), '%d/%m/%Y %H:%i:%s') as dt_created
					FROM ?? as lo
					WHERE id = ?
				`;

		var parameters = [
			table,
			id
		];

		sql = this.db.connect().format(sql, parameters);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}


	/**
	 *
	 */
	update(data){
		var inserts = [
			table
		];

		var fields = [];
		var where = "";

		if(data.title !== undefined && data.title !== ""){
			fields.push('title = ?');
			inserts.push(data.title);
		}

		if(data.description !== undefined && data.description !== ""){
			fields.push('description = ?');
			inserts.push(data.description);
		}

		if(data.numbers_count !== undefined && data.numbers_count !== ""){
			fields.push('numbers_count = ?');
			inserts.push(data.numbers_count);
		}

		if(data.percent_house !== undefined && data.percent_house !== ""){
			fields.push('percent_house = ?');
			inserts.push(data.percent_house);
		}

		if(data.percent_lottery !== undefined && data.parcent_lottery !== ""){
			fields.push('percent_lottery = ?');
			inserts.push(data.percent_lottery);
		}

		if(data.choice_numbers !== undefined && data.choice_numbers !== ""){
			fields.push('choice_numbers = ?');
			inserts.push(data.choice_numbers);
		}

		if(data.default_prize !== undefined && data.default_prize !== ""){
			fields.push('default_prize = ?');
			inserts.push(data.default_prize);
		}

		if(data.ticket_price !== undefined && data.ticket_price !== ""){
			fields.push('ticket_price = ?');
			inserts.push(data.ticket_price);
		}

		if(data.lottery_day !== undefined && data.lottery_day !== ""){
			fields.push('lottery_day = ?');
			inserts.push(data.lottery_day);
		}

		if(data.blocked !== undefined && data.blocked !== ""){
			fields.push('blocked = ?');
			inserts.push(data.blocked);
		}

		if(data.deleted !== undefined && data.deleted !== ""){
			fields.push('deleted = ?');
			inserts.push(data.deleted);
		}

		if(data.result !== undefined && data.result !== ""){
			fields.push('result = ?');
			inserts.push(data.result);
		}

		inserts.push(data.id);
		where = " WHERE id = ?";

		var sql = 'UPDATE ?? SET '+fields.join(', ')+where+' LIMIT 1';
		
		sql = this.db.connect().format(sql, inserts);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}


	/**
	 *
	 */
	softdelete(id){
		return this.mD.softdelete(table, id);
	}
}

module.exports = Lotteries;



