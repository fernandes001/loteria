const connection = require('../../config/connection');

// models
const Model = require('./Model');

const table = "tickets"; // default table


class Tickets {
	constructor(mD, db){
		this.mD = new Model();
		this.db = new connection();
	}

	
	/**
	 * 
	 */
	list(page, limit, filters = null){
		// ex: (1 * 10) - 10 = 0 // offset start
		var offset = (page * limit) - limit;
		if(offset < 0){
			offset = 0;
		}

		let where = [];

		if(filters !== null && Object.keys(filters).length > 0){
			if(filters.user_id !== undefined){
				where.push("tk.user_id = "+filters.user_id);
			}

			if(filters.lottery_id !== undefined){
				where.push("tk.lottery_id = "+filters.lottery_id);
			}

			where = where.join(" AND ");
			where = "WHERE "+where;
		}

		// get results
		var p1 = new Promise((resolve, reject) => {
			var sql = 
					`
						SELECT 
							lo.title as lottery_name,
							lo.result as lottery_result,
							DATE_FORMAT(FROM_UNIXTIME(lo.lottery_day), '%d/%m/%Y %H:%i:%s') as lottery_day,
							DATE_FORMAT(FROM_UNIXTIME(tk.dt_created), '%d/%m/%Y %H:%i:%s') as ticket_created_at,
							tk.* 
						FROM ?? AS tk 
						INNER JOIN lotteries AS lo ON lo.id = tk.lottery_id 
						`+where+`
						ORDER BY tk.id DESC 
						LIMIT ?,?
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
			var sql = 
					`
						SELECT 
							COUNT(tk.id) as total
						FROM ?? AS tk 
						INNER JOIN lotteries AS lo ON lo.id = tk.lottery_id 
						`+where+`
					`;

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
	 *
	 */
	create(data){
		var values = [
			data.user_id,
			data.dt_created,
			data.canceled,
			data.lottery_id,
			data.numbers_bet,
			data.qt_tickets,
			data.ticket_price
		];

		var sql = 
				`
					INSERT INTO ??
					(user_id, dt_created, canceled, lottery_id, numbers_bet, qt_tickets, ticket_price)
					VALUES (?)
				`;

		var parameters = [
			table,
			values
		];

		sql = this.db.connect().format(sql, parameters);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result)
			});
		});
	}
}

module.exports = Tickets;