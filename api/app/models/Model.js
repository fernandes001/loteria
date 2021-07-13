const connection = require("../../config/connection");

class Model{
	constructor(db){
		this.db = new connection();
	}


	/**
	 * Search specific data in specific table
	 * @param [field]{string} 			- field which you search
	 * @param [value]{string|integer} 	- value which you serach
	 * @param [table]{string} 			- table used for search
	 * @param [getFields]{array} 		- fields returned in the search
	 * @memberof Igma
	 * @method search
	 */
	search(field, value, table, getFields){
		var sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
		var inserts = [
			getFields,
			table,
			field,
			value
		];

		sql = this.db.connect().format(sql, inserts);

		return new Promise((resolve, reject) => {
			// return rows if result match
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
	softdelete(table, id){
		var sql = "UPDATE ?? SET deleted = 1 WHERE id = ? AND deleted = 0";
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
}


module.exports = Model;