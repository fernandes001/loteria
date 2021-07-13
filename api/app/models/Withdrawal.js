const connection = require("../../config/connection");
const Model = require("./Model");
const table = "withdrawal"; // default table

class Withdrawal {
	constructor(mD, db){
		this.mD = new Model();
		this.db = new connection();
	}

	/**
	 * 
	 */
	list(page, limit, user_id, filters = null){
		// ex: (1 * 10) - 10 = 0 // offset start
		var offset = (page * limit) - limit;
		if(offset < 0){
			offset = 0;
		}

		// get results
		var p1 = new Promise((resolve, reject) => {
			var sql = 
					`
						SELECT 
							id,
							(fee+amount) as amount,
							memo,
							status,
							to_address,
							txid,
							DATE_FORMAT(FROM_UNIXTIME(dt_created), '%d/%m/%Y %H:%i:%s') as dt_created
						FROM ??
						WHERE user_id = ? 
						ORDER BY id DESC 
						LIMIT ?,?
					`;
			
			var parameters = [
				table,
				user_id,
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
							COUNT(id) as total
						FROM ??
						WHERE user_id = ?
					`;

			var parameters = [
				table,
				user_id
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


	getRecords(limit){
		let sql = 
				`
					SELECT * FROM ?? WHERE status = 'pending' ORDER BY id ASC LIMIT ?
				`;

		let parameters = [
			table,
			limit
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

	update(data){
		let parameters = [
			table
		];

		let fields = [];
		let where = "";

		if(data.memo !== undefined && data.memo !== ""){
			fields.push('memo = ?');
			parameters.push(data.memo);
		}

		if(data.txid !== undefined && data.txid !== ""){
			fields.push('txid = ?');
			parameters.push(data.txid);
		}

		if(data.raw !== undefined && data.raw !== ""){
			fields.push('raw = ?');
			parameters.push(data.raw);
		}

		if(data.type !== undefined && data.type !== ""){
			fields.push('type = ?');
			parameters.push(data.type);
		}

		if(data.status !== undefined && data.status !== ""){
			fields.push('status = ?');
			parameters.push(data.status);
		}

		parameters.push(data.id);
		where = " WHERE id = ?";

		let sql = 'UPDATE ?? SET '+fields.join(', ')+where+' LIMIT 1';
		
		sql = this.db.connect().format(sql, parameters);

		console.log('sql', sql);

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
	create(data){
		let values = [
			data.user_id,
			data.fee,
			data.amount,
			data.memo === undefined || data.memo === '' ? null : data.memo,
			data.to_address,
			'withdrawal', // type
			'pending', // status
			data.dt_created
		];

		let sql = `
			INSERT INTO ?? 
			(user_id, fee, amount, memo, to_address, type, status, dt_created)
			VALUES
			(?)
		`;

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
}

module.exports = Withdrawal;