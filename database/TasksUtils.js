let rootUtils = require('./root.js');

class TasksUtils extends rootUtils {
	constructor(Client, conOptions){
		super();
		this.Client = Client;
		this.conOptions = conOptions;
	}
	getNameId(next) {
		var sSQL = 'SELECT t."ID", t."IDStatus", "IDTaskType" from public."tTask" t';
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}
	getAll(next, api) {
		var sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on t."IDTasktype" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" = 1
					 		`;
		sSQL = sSQL + 'order by t."ID"';
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			console.log(tasks);
			next(tasks);
		})
	}
	getStatus(nID, next){
		var sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus",
									s."Name" as "StatusName"
								FROM public."tTask" t
								left join public."tStatus" s on s."ID" = t."IDStatus"
								where t."ID" = ${nID}`;
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}
	update(taskData, next){
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = "";
		if (taskData.sPostOperation == "del") {
			sSQL = 'update public."tTask" set "IDStatus"=2 '+
					'where "ID" = '+taskData.nID;
		} else {
			sSQL = `update public."tTask" set
					"IDTasktype"=${taskData.nTaskTypeID},
					"IDStatus" = ${taskData.nStatusID}
					where "ID" = ${taskData.nID}`;
		}
		console.log(sSQL);
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
		var rowTaskData = {};
		const client = new this.Client(this.conOptions);
		client.connect();
		var sSQL = `SELECT ts."ID", ts."IDTasktype", ts."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" ts
								join public."tTaskType" tt on ts."IDTasktype" = tt."ID"
								left join public."tStatus" st on ts."IDStatus" = st."ID"
								where t."ID" = ${nID} `;
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
	logGetByID(nUserID, nTaskID, dataCount, next){
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
	}
	getByTasktype(nID, next, api){
		var sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on t."IDTasktype" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" in (1, 2)
								AND t."IDTasktype" = ${nID} `;
		sSQL = sSQL + 'order by t."ID"';
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}
	customSelect(next){
		let sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus" FROM public."tTask" t where "IDStatus" = 1`;
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}
	create(task, next){
		let sSQL = `insert into public."tTask" ( "IDTasktype", "IDStatus")
				values(${task.IDTasktype}, ${task.IDStatus}) RETURNING "ID"`;
		console.log(sSQL);
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
	getArchived(next){
		var sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus",
									tt."Name" as "TaskTypeName", st."Name" as "StatusName"
								FROM public."tTask" t
								join public."tTaskType" tt on t."IDTasktype" = tt."ID"
								join public."tStatus" st on t."IDStatus" = st."ID"
								where t."IDStatus" = 2
								order by t."ID"`;
		console.log(sSQL);
		this.execute(sSQL, (tasks) => {
			next(tasks);
		})
	}
	getActive(next){
		let sSQL = `SELECT t."ID", t."IDTasktype", t."IDStatus" FROM public."tTask" t where "IDStatus" = 1`;
		console.log(sSQL);
		this.execute(sSQL, (data) => {
			next(data);
		})
	}
}

module.exports = TasksUtils;
