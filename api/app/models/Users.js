const connection = require("../../config/connection");
const Model = require("./Model");
const table = "users"; // default table


class Users {
	constructor(mD, db){
		this.mD = new Model();
		this.db = new connection();
	}


	/**
	 * List users from database
	 * @param {number} - page - number with this result start
	 * @param {number} - limit - number with this result end
	 * @memberof Igma
	 * @method list
	 */
	list(page, limit, search, filters = null){
		// ex: (1 * 10) - 10 = 0 // offset start
		var offset = (page * limit) - limit;
		if(offset < 0){
			offset = 0;
		}

		let where = [];
		where.push("WHERE (email LIKE "+this.db.connect().escape("%"+search+"%")+" OR user_name LIKE "+this.db.connect().escape("%"+search+"%")+')');

		if(filters !== null && Object.keys(filters).length > 0){
			
			if(filters.blocked !== undefined){
				where.push("blocked = "+filters.blocked);
			}

			if(filters.deleted !== undefined){
				where.push("deleted = "+filters.deleted);
			}

			where = where.join(" AND ");
		}

		// get results
		var p1 = new Promise((resolve, reject) => {
			//var sql = 'SELECT id, email, user_name, account_checked, twofa_status, level, blocked, deleted, dt_created FROM ?? '+where+' ORDER BY id DESC LIMIT ?,?';
			
			var sql = 
					`
						SELECT 
							usu.id,
							(SELECT SUM(amount) FROM deposits WHERE user_id = usu.id AND status = 'completed') AS deposits_sum,
					    	(SELECT SUM(amount+fee) FROM withdrawal WHERE user_id = usu.id) AS withdrawal_sum,
					    	(SELECT SUM(ticket_price * qt_tickets) FROM tickets WHERE user_id = usu.id) AS tickets_sum,
							usu.email, 
							usu.user_name, 
							usu.account_checked, 
							usu.twofa_status, 
							usu.level, 
							usu.blocked, 
							usu.deleted, 
							usu.dt_created 
						FROM ?? as usu `+where+` ORDER BY usu.id DESC LIMIT ?,?
					`;

			var inserts = [
				table,
				offset,
				limit
			];

			sql = this.db.connect().format(sql, inserts);

			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});

		// count all results in database
		var p2 = new Promise((resolve, reject) => {
			var sql = 'SELECT COUNT(id) as total FROM ?? '+where;

			var inserts = [
				table
			];

			sql = this.db.connect().format(sql, inserts);

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
	 * Find user for authentication
	 * @param {string} - data.email[max: ] - email
	 * @param {string} - data.password[max: ] - password
	 * @memberof Igma
	 * @method auth
	 */
	auth(data){
		var sql = 'SELECT id, email, user_name, level FROM ?? WHERE email = ? AND password = ? AND blocked = 0 AND deleted = 0 AND account_checked = 1';
		var inserts = [
			table, 
			data.email, 
			data.password
		];
		
		sql = this.db.connect().format(sql, inserts); // prepare query

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
	 * @param {string} - field - field - field which you search
	 * @param {string|integer} - value - value which you serach
	 * @memberof Igma
	 * @method search
	 */
	search(field, value, getFields){
		return this.mD.search(field, value, table, getFields);
	}


	/**
	 *
	 */
	create(data){
		var values = [
			data.email, // email
			data.password, // password
			0, // account_checked
			0, // twofa_status
			data.token, // token
			1, // level
			0, // blocked
			data.dt_token_expiration, // dt_token_expiration
			data.dt_created // dt_created
		]

		var sql = 'INSERT INTO ?? (email, password, account_checked, twofa_status, token, level, blocked, dt_token_expiration, dt_created) VALUES (?)';

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
				resolve(result);
			});
		});
	}


	/**
	 * Use soft delete for remove user
	 */
	softdelete(id){
		return this.mD.softdelete(table, id);
	}


	/**
	 *
	 */
	update(data, token = false){
		var inserts = [
			table
		];
		var fields = [];
		var where = "";

		if(data.email !== undefined && data.email !== ""){
			fields.push('email = ?');
			inserts.push(data.email);
		}
		if(data.user_name !== undefined && data.user_name !== ""){
			fields.push('user_name = ?');
			inserts.push(data.user_name);
		}
		if(data.password !== undefined && data.password !== ""){
			fields.push('password = ?');
			inserts.push(data.password);
		}
		if(data.twofa_status !== undefined && data.twofa_status !== ""){
			fields.push('twofa_status = ?');
			inserts.push(data.twofa_status);
		}
		if(data.level !== undefined && data.level !== ""){
			fields.push('level = ?');
			inserts.push(data.level);
		}
		if(data.blocked !== undefined && data.blocked !== ""){
			fields.push('blocked = ?');
			inserts.push(data.blocked);
		}
		if(data.account_checked !== undefined && data.account_checked !== ""){
			fields.push('account_checked = ?');
			inserts.push(data.account_checked);
		}
		if(data.twofa_code !== undefined && data.twofa_code !== ""){
			fields.push('twofa_code = ?');
			inserts.push(data.twofa_code);
		}
		if(data.dt_token_expiration !== undefined && data.dt_token_expiration !== ""){
			fields.push('dt_token_expiration = ?');
			inserts.push(data.dt_token_expiration);
		}
		if(data.token !== undefined && data.token !== ""){
			fields.push('token = ?');
			inserts.push(data.token);
		}

		if(token === false){
			inserts.push(data.id);
			where = " WHERE id = ?";
		} else {
			inserts.push(data.token);
			where = " WHERE token = ?";
		}

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
	get(id) {
		var sql = 
				`
					SELECT 
						id, 
						(SELECT SUM(amount) FROM deposits WHERE user_id = usu.id AND status = 'completed') AS deposits_sum,
				    	(SELECT SUM(amount+fee) FROM withdrawal WHERE user_id = usu.id) AS withdrawal_sum,
				    	(SELECT SUM(ticket_price * qt_tickets) FROM tickets WHERE user_id = usu.id) AS tickets_sum,
						email, 
						user_name, 
						account_checked, 
						twofa_status, 
						level, 
						blocked, 
						dt_created 
					FROM ?? as usu 
					WHERE id = ?
				`;
		

		var inserts = [
			table,
			id
		];
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
	getTokenExpiration(token){
		var sql = 'SELECT id, dt_token_expiration FROM ?? WHERE token = ?';
		
		var parameters = [
			table,
			token
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
	balance(user_id){
		var sql = 
				`
					SELECT 
						usu.id,
					    (SELECT SUM(amount) FROM deposits WHERE user_id = usu.id AND status = 'completed') AS deposits_sum,
					    (SELECT SUM(amount+fee) FROM withdrawal WHERE user_id = usu.id) AS withdrawal_sum,
					    (SELECT SUM(ticket_price * qt_tickets) FROM tickets WHERE user_id = usu.id) AS tickets_sum
					FROM ?? AS usu WHERE usu.id = ?
				`;
		
		var parameters = [
			table,
			user_id
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
}

module.exports = Users;

