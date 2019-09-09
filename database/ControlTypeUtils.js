let rootUtils = require('./root.js');

class ControlTypeUtils extends rootUtils{
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	getNameID(next){
		console.log("ControlTypeUtils.getNameID");
		var sSQL = 'SELECT ct."ID", ct."Name" from public."tControlType" ct ';
		//console.log(sSQL);
		this.execute(sSQL, (controlTypeList) => {
			next(controlTypeList);
		})
	}
}

module.exports = ControlTypeUtils;
