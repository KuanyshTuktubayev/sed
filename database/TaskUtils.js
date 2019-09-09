let rootUtils = require('./root.js');

class TaskUtils extends rootUtils {
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	/*getNameId(next) {
		var sSQL = 'SELECT t."ID", t."IDStatus", "IDTaskType" from public."tTask" t';
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}*/
	getAll(next, api) {
		console.log("TaskUtils.getAll");
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus", t."IDDoc",
									tt."Name" as "TaskTypeName", tst."Name" as "StatusName",
									d."IDControlType", ct."Name" as "ControlTypeName",
									d."InNum", d."OutNum", d."Tel", d."ShortContent",
									d."IDDocType", dt."Name" as "DocTypeName",
									d."IDStatus" as "IDDocStatus", dst."Name" as "DocStatusName",
									TO_CHAR(d."DocDate", \'DD-MM-YYYY\') as "DocDate"
									--TO_CHAR(d."DocDate", \'DD-MM-YYYY HH24:MI\') as "DocDate"
								FROM public."tTask" t
								join public."tTaskType" tt on tt."ID" = t."IDTaskType"
								join public."tStatus" tst on tst."ID" = t."IDStatus"
								join public."tDoc" d on d."ID" = t."IDDoc"
								left join public."tStatus" dst on dst."ID" = d."IDStatus"
								left join public."tControlType" ct on ct."ID" = d."IDControlType"
								left join public."tDocType" dt on dt."ID" = d."IDDocType"
								where t."IDStatus" != 7
					 		`;
		sSQL = sSQL + 'order by t."ID"';
		//console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			//console.log(tasks);
			next(tasks);
		})
	}
	/*getStatus(nID, next){
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus",
									s."Name" as "StatusName"
								FROM public."tTask" t
								left join public."tStatus" s on s."ID" = t."IDStatus"
								where t."ID" = ${nID}`;
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}*/
	update(taskData, next){
		console.log("TaskUtils.update");
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = "";
		if (taskData.sPostOperation == "del") {
			sSQL = 'update public."tTask" set "IDStatus"=2 where "ID" = '+taskData.nID;
		} else {
			sSQL = `update public."tTask" set
								"IDTaskType"=${taskData.nTaskTypeID},
								"IDDoc" = ${taskData.nIDDoc}
							where "ID" = ${taskData.nID}`;
		}
		//console.log(sSQL);
		client.query(sSQL, (qerr, qres) => {
			var sResMsg = "";
			if (taskData.sPostOperation == "del") {
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
	getById(nID, next, api){
		console.log("TaskUtils.getById");
		var rowTaskData = {};
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDDoc", t."IDStatus",
									tt."Name" as "TaskTypeName", tst."Name" as "TaskStatusName",
									d."IDControlType", d."InNum" as "DocInNum",
									d."OutNum" as "DocOutNum",
									TO_CHAR(d."DocDate", \'YYYY-MM-DD\') as "DocDate",
									d."IDStatus" as "DocIDStatus", d."Tel" as "DocTel",
									d."IDDocType", d."ShortContent" as "DocShortContent",
									dt."Name" as "DocTypeName", dst."Name" as "DocStatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on tt."ID" = t."IDTaskType"
								left join public."tStatus" tst on tst."ID" = t."IDStatus"
								left join public."tDoc" d on d."ID" = t."IDDoc"
								left join public."tDocType" dt on dt."ID" = d."IDDocType"
								left join public."tStatus" dst on dst."ID" = d."IDStatus"
								where t."ID" = ${nID} `;
		//console.log(sSQL);
		client.query(sSQL, (qerr, qres) => {
			if (qerr) {
				console.log("qerr:");
				console.log(qerr ? qerr.stack : qres);
			}
			else {
				//console.log(qres)
				//console.log('qres.rows:')
				//console.log(qres.rows)
				//console.log(qerr ? qerr.stack : qres);
				if (typeof qres.rowCount === 'undefined') {
					console.log('rowTaskData res.rowCount not found');
				}
				else {
					if (qres.rowCount == 0) {
						console.log('rowTaskData res.rowCount='+qres.rowCount);
						rowTaskData = qres.rows;
					}
					else {
						rowTaskData = qres.rows;
					}
				}
			}
			client.end();
			next(rowTaskData, qres);
		})
	}
	/*logGetByID(nUserID, nTaskID, dataCount, next){
		var sDescr = "";
		if (dataCount > 0) {
			sDescr = "Task found.";
		}
		else {
			sDescr = "Task not found.";
		}
		let sSQL = `insert into public."tLogUserActions" ( "IDUser", "Descr", "ADate")
								values('${nUserID}', 'get task data by ID=${nTaskID}. ${sDescr}', now()) RETURNING "ID"`;
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
	/*getByTaskType(nID, next, api){
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on t."IDTaskType" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" in (1, 2)
								AND t."IDTaskType" = ${nID} `;
		sSQL = sSQL + 'order by t."ID"';
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}*/
	/*customSelect(next){
		let sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus" FROM public."tTask" t where "IDStatus" = 1`;
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}*/
	create(task, next){
		console.log("TaskUtils.create");
		let sSQL = `insert into public."tTask" ( "IDTaskType", "IDStatus", "IDDoc" )
								values( ${task.IDTaskType}, ${task.IDStatus}, ${task.IDDoc} )
								RETURNING "ID"`;
		//console.log(sSQL);
		this.execute(sSQL, (data) => {
			let newTaskID = 0,
			    sResultMsg = "";
			if ( data.length > 0 ){
				newTaskID = data[0].ID;
				sResultMsg = "ok, new TaskID="+newTaskID;
			}
			else {
				sResultMsg = "ERROR!";
			}
			next({ResultMsg: sResultMsg, ID: newTaskID});
		})
	}
	/*getArchived(next){
		var sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on t."IDTaskType" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" = 2
								order by t."ID"`;
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}*/
	/*getActive(next){
		let sSQL = `SELECT t."ID", t."IDTaskType", t."IDStatus" FROM public."tTask" t where "IDStatus" = 1`;
		console.log(sSQL);
		this.execute(sSQL, (data) => {
			next(data);
		})
	}*/
}

module.exports = TaskUtils;
