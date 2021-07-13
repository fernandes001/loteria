const mysql = require('mysql');
var con;

const gConf = require('./global');

class db {
	connect(){
		if(!con){
			con = mysql.createConnection({
				//host: "db",
				//user: "user",
				//password: "password",
				//database: "project"
				host: gConf.db_host,
				user: gConf.db_user,
				password: gConf.db_password,
				database: gConf.db_database
			});

			con.connect(function(err) {
		  		if (err) {
			    	console.error('---> Error connecting: ' + err.stack);
			    	return;
			  	}
			 
			  	console.log('---> Connected as thread: ' + con.threadId);
			});
		}
		return con;
	}
}


module.exports = db;