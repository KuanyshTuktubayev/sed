let conn       = require('./../routes/conn.js'),
    Client 	   = conn.connClient,
	  conOptions = conn.conOptions;

let user = require('./UserUtils.js'),
	  role = require('./RoleUtils.js'),
    task = require('./TaskUtils.js'),
    taskType = require('./TaskTypeUtils.js'),
    controlType = require('./ControlTypeUtils.js'),
    docType = require('./DocTypeUtils.js'),
    doc = require('./DocUtils.js');

// для всех
let db = {
	Users: new user(Client, conOptions),
	Role:  new role(Client, conOptions),
  Task:  new task(Client, conOptions),
  TaskType: new taskType(Client, conOptions),
  ControlType: new controlType(Client, conOptions),
  DocType: new docType(Client, conOptions),
  Doc: new doc(Client, conOptions)
}

module.exports = db;
