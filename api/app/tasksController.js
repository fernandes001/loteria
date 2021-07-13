const withdrawalCtrl = require('./controllers/withdrawalController');

const gConf = require('../config/global');

class tasksController{
	constructor(){
		this.withdrawal = new withdrawalCtrl();
	}

	/**
	 * 
	 */
	taskWithdrawal(){
		this.withdrawal.getRecords(10);
	}

	taskDeposits(){
		console.log('deposits');
	}

	queue(){
		this.taskWithdrawal();
		this.taskDeposits();
		
		setTimeout(() => {
			this.queue();
		}, gConf.tasks_exec_interval);
	}
}

module.exports = tasksController;