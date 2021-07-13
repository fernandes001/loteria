const crypto = require('crypto');
const nodemailer = require('nodemailer');
const gConf = require('../../config/global.json');

module.exports = {
	'cryptoSha256' : function(string){
		let hash = crypto.createHash('sha256');

		hash.update(string);
		return hash.digest('hex');
	},


	'cryptoMd5' : function(string){
		let hash = crypto.createHash('md5');

		hash.update(string);
		return hash.digest('hex');
	},


	'sendEmail' : function(data){
		let transporter = nodemailer.createTransport({
			"host" : gConf.mailHost,
			"port" : gConf.mailPort,
			"secure" : gConf.mailSecure,
			"auth" : {
				"user" : gConf.mailUser,
				"pass" : gConf.mailPassword
			}
		});

		let mailOptions = {
			"from" : '"IGMA Corp" <'+gConf.mailFrom+'>',
			"to" : data.to,
			"subject" : data.subject,
			"text" : data.text
		};

		return new Promise((resolve, reject) => {
			transporter.sendMail(mailOptions, (err, info) => {
				if(err){
					reject(err);
				}

				resolve(info);
			});
		});
	}, 

	
	'timestamp' : function(defaultDate = null){
		// TODO validate string date
		var date;
		if(defaultDate === null){
			date = new Date().getTime();
		} else {
			if(defaultDate.length === 16 || defaultDate.length === 19){
				// DD/MM/YYYY to YYYY-MM-DD
				let first = defaultDate.split('/');
				let second = first[2].split(' ');

				// Mount
				let newDate = second[0]+'-'+first[1]+'-'+first[0]+' '+second[1];

				date = new Date(newDate).getTime(); // YYYY-MM-DD
				if(isNaN(date)){
					return false;
				}
			} else {
				return false;
			}
		}
		date = String(date);
		date = date.slice(0, 10);
		return parseInt(date);
	},


	'randomstring' : function(length){
		var string = "";
	  	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  	for (var i = 0; i < length; i++){
		    string += possible.charAt(Math.floor(Math.random() * possible.length));
	  	}

  		return string;
	}
}