let rootUtils = require('./root.js');

class TaskTypeUtils extends rootUtils{
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	getAll(next){
		var sSQL = `SELECT tt."ID", tt."Name" FROM public."tTaskType" tt `;
		console.log(sSQL);
		this.execute(sSQL, (tasktypes) => {
			next(tasktypes);
		})
	}
	getNameID(next){
		var sSQL = 'SELECT tt."ID", tt."Name" FROM public."tTaskType" tt ';
		console.log(sSQL);
		this.execute(sSQL, (tasktypes) => {
			next(tasktypes);
		})
	}
	getByID(nID, next){
		var sSQL = `SELECT tt."ID", tt."Name"
								FROM public."tTaskType" tt
								where tt."ID" = ${nID}`;
		console.log(sSQL);
		this.execute(sSQL, (tasktypes) => {
			next(tasktypes);
		})
	}
}

module.exports = TaskTypeUtils;
