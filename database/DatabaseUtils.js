let conn     = require('./../routes/conn.js'),
  Client 	   = conn.connClient,
	conOptions = conn.conOptions;

let user = require('./UserUtils.js'),
	role   = require('./RoleUtils.js'),
  task   = require('./TasksUtils.js'),
  tasktype = require('./TaskTypeUtils.js');

// для всех
let db = {
	Users: new user(Client, conOptions),
	Role:  new role(Client, conOptions),
  Task:  new task(Client, conOptions),
  Tasktype: new tasktype(Client, conOptions)
}

module.exports = db;
