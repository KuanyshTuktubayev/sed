let rootUtils = require('./root.js');

class DocTypeUtils extends rootUtils{
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	getNameID(next){
		console.log("DocTypeUtils.getNameID");
		var sSQL = 'SELECT dt."ID", dt."Name" from public."tDocType" dt ';
		//console.log(sSQL);
		this.execute(sSQL, (docTypeList) => {
			next(docTypeList);
		})
	}
}

module.exports = DocTypeUtils;
