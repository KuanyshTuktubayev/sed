let rootUtils = require('./root.js');

class TaskTypeUtils extends rootUtils{
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	/*getAll(next){
		var sSQL = `SELECT tt."ID", tt."Name" FROM public."tTaskType" tt `;
		console.log(sSQL);
		this.execute(sSQL, (taskTypes) => {
			next(taskTypes);
		})
	}*/
	getNameID(next){
		console.log("TaskTypeUtils.getNameID");
		var sSQL = 'SELECT tt."ID", tt."Name" FROM public."tTaskType" tt ';
		//console.log(sSQL);
		this.execute(sSQL, (taskTypes) => {
			next(taskTypes);
		})
	}
	/*getByID(nID, next){
		var sSQL = `SELECT tt."ID", tt."Name"
								FROM public."tTaskType" tt
								where tt."ID" = ${nID}`;
		console.log(sSQL);
		this.execute(sSQL, (taskTypes) => {
			next(taskTypes);
		})
	}*/
}

module.exports = TaskTypeUtils;
