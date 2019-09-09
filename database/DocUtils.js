let rootUtils = require('./root.js');

class DocUtils extends rootUtils {
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	/*getNameId(next) {
		var sSQL = 'SELECT d."ID", d."IDStatus", d."IDDocType" from public."tDoc" d';
		console.log(sSQL);
		this.execute(sSQL, (docs) => {
			next(docs);
		})
	}*/
	/*getAll(next, api) {
		var sSQL = `SELECT d."IDControlType", ct."Name" as "ControlTypeName",
									d."InNum", d."OutNum", d."Tel", d."ShortContent",
									d."IDDocType", dt."Name" as "DocTypeName",
									d."IDStatus" as "IDDocStatus", dst."Name" as "DocStatusName",
									d."DocDate"
								FROM public."tDoc" d
								left join public."tStatus" dst on dst."ID" = d."IDStatus"
								left join public."tControlType" ct on ct."ID" = d."IDControlType"
								left join public."tDocType" dt on dt."ID" = d."IDDocType"
								where t."IDStatus" != 7
					 		`;
		sSQL = sSQL + 'order by d."ID"';
		console.log(sSQL);
		this.execute(sSQL, (docs) => {
			console.log(docs);
			next(docs);
		})
	}*/
	/*getStatus(nID, next){
		var sSQL = `SELECT d."ID", d."IDDocType", d."IDStatus",
									s."Name" as "StatusName"
								FROM public."tDoc" d
								left join public."tStatus" s on s."ID" = d."IDStatus"
								where d."ID" = ${nID}`;
		console.log(sSQL);
		this.execute(sSQL, (docs) => {
			next(docs);
		})
	}*/
	update(docData, next){
		console.log("DocUtils.update");
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = "";
		if (docData.sPostOperation == "del") {
			sSQL = 'update public."tDoc" set "IDStatus"=2 where "ID" = '+docData.nID;
		} else {
			sSQL = `update public."tDoc" set
								"IDDocType"=${docData.nDocTypeID},
								"IDControlType"=${docData.nControlTypeID},
								"InNum"='${docData.sDocInNum}',
								"OutNum"='${docData.sDocOutNum}',
								"Tel"='${docData.sDocTel}',
								"DocDate"=to_timestamp('${docData.sDocDate}', 'YYYY/MM/DD HH24:MI:SS')
							where "ID" = ${docData.nID}`;
		}
		//console.log(sSQL);
		client.query(sSQL, (qerr, qres) => {
			var sResMsg = "";
			if (docData.sPostOperation == "del") {
				sResMsg = "Удалено";
			}
			else {
				sResMsg = "Сохранено";
			}
			if (qerr) {
				console.log("qerr:");
				console.log(qerr ? qerr.stack : qres);
				sResMsg = "Ошибка выполнения: "+qerr;
			}
			client.end();
			next(sResMsg);
		});
	}
	/*getById(nID, next, api){
		var rowDocData = {};
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = `SELECT d."ID", d."IDDocType", d."IDStatus",
									dt."Name" as "DocTypeName", st."Name" as "StatusName"
								FROM public."tDoc" d
								join public."tDocType" dt on d."IDDocType" = dt."ID"
								left join public."tStatus" st on d."IDStatus" = st."ID"
								where d."ID" = ${nID} `;
		//console.log(sSQL);
		client.query(sSQL, (qerr, qres) => {
			if (qerr) {
				console.log("qerr:");
				console.log(qerr ? qerr.stack : qres);
			}
			else {
				//console.log(qres)
				console.log(qres.rows)
				//console.log(qerr ? qerr.stack : qres);
				if (typeof qres.rowCount === 'undefined') {
					console.log('rowDocData res.rowCount not found');
				}
				else {
					if (qres.rowCount == 0) {
						console.log('rowDocData res.rowCount='+qres.rowCount);
						rowDocData = qres.rows;
					}
					else {
						rowDocData = qres.rows;
					}
				}
			}
			client.end();
			next(rowDocData, qres);
		})
	}*/
	/*logGetByID(nUserID, nDocID, dataCount, next){
		var sDescr = "";
		if (dataCount > 0) {
			sDescr = "Doc found.";
		}
		else {
			sDescr = "Doc not found.";
		}
		let sSQL = `insert into public."tLogUserActions" ( "IDUser", "Descr", "ADate")
								values('${nUserID}', 'get doc data by ID=${nDocID}. ${sDescr}', now()) RETURNING "ID"`;
		console.log(sSQL);
		this.execute(sSQL, (data) => {
			let newLogID = 0,
			    isError = false;
			if ( data.length > 0 ){
				newLogID = data[0].ID;
				isError = false;
			}
			else {
				isError = true;
			}
			next({ResultIsOK: isError});
		})
	}*/
	/*getByDoc(nID, next, api){
		var sSQL = `SELECT d."ID", d."IDDocType", d."IDStatus",
									dt."Name" as "DocTypeName", st."Name" as "StatusName"
								FROM public."tDoc" t
								join public."tDocType" dt on t."IDDocType" = dt."ID"
								join public."tStatus" st on d."IDStatus" = st."ID"
								where d."IDStatus" in (1, 2)
								AND d."IDDocType" = ${nID} `;
		sSQL = sSQL + 'order by d."ID"';
		console.log(sSQL);
		this.execute(sSQL, (docs) => {
			next(docs);
		})
	}*/
	/*customSelect(next){
		let sSQL = `SELECT d."ID", d."IDDocType", d."IDStatus" FROM public."tDoc" d where "IDStatus" = 1`;
		this.execute(sSQL, (docs) => {
			next(docs);
		})
	}*/
	create(doc, next){
		console.log("DocUtils.create");
		let sSQL = `insert into public."tDoc" ( "IDControlType", "InNum", "DocDate", "IDStatus", "OutNum", "Tel", "IDDocType", "ShortContent" )
								values(${doc.IDControlType}, '${doc.DocInNum}', '${doc.DocDate || 'now()'}', ${doc.IDStatus}, '${doc.DocOutNum}', '${doc.DocTel}', ${doc.IDDocType}, '${doc.DocShortContent}')
								RETURNING "ID"`;
		//console.log(sSQL);
		this.execute(sSQL, (data) => {
			let newDocID = 0,
			    sResultMsg = "";
			if ( data.length > 0 ){
				newDocID = data[0].ID;
				sResultMsg = "ok, new DocID="+newDocID;
			}
			else {
				sResultMsg = "ERROR!";
			}
			next({ResultMsg: sResultMsg, ID: newDocID});
		})
	}
	/*getArchived(next){
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tDoc" d
								join public."tTaskType" tt on t."IDTaskType" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" = 2
								order by t."ID"`;
		console.log(sSQL);
		this.execute(sSQL, (docs) => {
			next(docs);
		})
	}*/
	/*getActive(next){
		let sSQL = `SELECT d."ID", d."IDDocType", d."IDStatus" FROM public."tDoc" d where "IDStatus" = 1`;
		console.log(sSQL);
		this.execute(sSQL, (data) => {
			next(data);
		})
	}*/
}

module.exports = DocUtils;
