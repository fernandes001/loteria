const express = require('express');
const bodyParser = require('body-parser');

const rUsers = require('./routes/users');
const rLotteries = require('./routes/lotteries');
const rAuth = require('./routes/auth');
const rDeposits = require('./routes/deposits');
const rTickets = require('./routes/tickets');
const rWithdrawal = require('./routes/withdrawal');

const tasksCtrl = require('./app/tasksController');
tasks = new tasksCtrl();

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// define headers
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(rUsers);
app.use(rLotteries);
app.use(rAuth);
app.use(rDeposits);
app.use(rTickets);
app.use(rWithdrawal);

// tasks
tasks.queue();

app.listen(3000, function(){
	console.log('Server started...');
});

