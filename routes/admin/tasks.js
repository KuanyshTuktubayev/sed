module.exports = (router, dbUtils, sAdminPageTitle) => {

	//открытие страницы "localhost:3000/admin/tasks", отображение списка заданий
	router.get('/tasks', function(req, res, next) {
		console.log("GET /admin/tasks");
		let sAdminLogin = "",
				sessData = req.session;
		//console.log(sessData);
		if ( sessData.admControl ) {
			sAdminLogin = sessData.admControl.Login;
		}
		else {
			res.redirect('/admin');
			return;
		}
		dbUtils.Task.getAll((tasks) => {
			if ( !tasks.length ) tasks = [];
			res.render('admintasks', {title: sAdminPageTitle, adminLogin: sAdminLogin, tasksList: tasks, archive: false});
		})
	});
	//создание задания
	router.post('/tasks', function(req, res, next) {
		console.log("POST /admin/tasks");
		let sAdminLogin = "",
				sessData = req.session;
		if ( sessData.admControl ) {
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		let postOperation = req.body.postOperation;
		dbUtils.Task.insert(postOperation, (ans) => {
			res.send(ans);
		})
	});

	//открытие страницы редактирования одного задания "localhost:3000/admin/task/123", где 123 это идентификатор задачи
	router.get('/task/:id', function(req, res, next) {
		console.log("GET /admin/task/id");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
			sAdminLogin = sessData.admControl.Login;
		}
		else {
			res.redirect('/admin');
			return;
		}
		let nID = req.params.id,
				rowTaskData = {},
				taskTypeList = {},
				controlTypeList = {},
				docTypeList = {};
		dbUtils.Task.getById(nID, (rowTaskData, qres) => {
			dbUtils.TaskType.getNameID((taskTypeList) => {
				if (typeof rowTaskData[0].IDTaskType === 'undefined') {
					//do nothing
				}
				dbUtils.ControlType.getNameID((controlTypeList) => {
					if (typeof rowTaskData[0].IDControlType === 'undefined') {
						//do nothing
					}
					dbUtils.DocType.getNameID((docTypeList) => {
						if (typeof rowTaskData[0].IDDocType === 'undefined') {
							//do nothing
						}
						res.render('admintaskedit', {
							title: sAdminPageTitle,
							adminLogin: sAdminLogin,
							taskData: rowTaskData,
							taskID: nID,
							taskTypes: taskTypeList,
							controlTypes: controlTypeList,
							docTypes: docTypeList
						});
					});
				});
			});
		});
	});
	//сохранение изменений задания
	router.post('/task/:id', function(req, res, next) {
		console.log("POST /admin/task/id");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		if(!req.body){
			console.log("req.body is null. Redirect to task/id...");
			res.send('req.body is null');
			return;
		}
		let docData = {
			nID:						req.body.docID,
			sPostOperation: req.body.postOperation,
			nControlTypeID: req.body.controlTypeID,
			nDocTypeID: 		req.body.docTypeID,
			sDocInNum: 			req.body.docInNum,
			sDocOutNum: 		req.body.docOutNum,
			sDocTel: 				req.body.docTel,
			sDocDate: 			req.body.docDate
		};
		let taskData = {
			nID:						req.params.id, //req.body.taskID,
			sPostOperation: req.body.postOperation,
			nTaskTypeID: 		req.body.taskTypeID,
			nIDDoc:					req.body.docID
		};
		dbUtils.Doc.update(docData, (sResMsgDoc) => {
			dbUtils.Task.update(taskData, (sResMsgTask) => {
				res.send("Документ: "+sResMsgDoc+"; Задание: "+sResMsgTask);
			})
		})
	});

	router.get('/taskGetStatus/:id', function(req, res, next){
		console.log("GET /admin/taskGetStatus/id");
		let nID = req.params.id;
		dbUtils.Task.getStatus(nID, (rowTaskData) => {
			res.json(rowTaskData);
		})
	});

	router.get('/task/archive/:id', function(req, res, next){
		console.log("GET /admin/task/archive/id");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		let nID = req.params.id;
		dbUtils.Task.update({ sPostOperation: 'del', nID: nID },(data) => {
			res.redirect('/admin/tasks/');
		})
	})

	router.get('/tasks/new', function(req, res, next){
		console.log("GET /admin/tasks/new");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		dbUtils.TaskType.getNameID((taskTypes) => {
			var taskTypes_loc = taskTypes;
			if (taskTypes.length > 0) {
				taskTypes_loc = taskTypes;
			}
			else {
				taskTypes_loc = [{ID: 0, Name: "Неизвестно"}];
			}
			dbUtils.ControlType.getNameID((controlTypes) => {
				var controlTypes_loc = controlTypes;
				if (controlTypes.length > 0) {
					controlTypes_loc = controlTypes;
				}
				else {
					controlTypes_loc = [{ID: 0, Name: "Неизвестно"}];
				}
				dbUtils.DocType.getNameID((docTypes) => {
					var docTypes_loc = docTypes;
					if (docTypes.length > 0) {
						docTypes_loc = docTypes;
					}
					else {
						docTypes_loc = [{ID: 0, Name: "Неизвестно"}];
					}
					res.render('admintasknew', {
						title: sAdminPageTitle,
						adminLogin: sAdminLogin,
						taskTypes: taskTypes_loc,
						controlTypes: controlTypes_loc,
						docTypes: docTypes_loc
					});
				})
			})
		})
	})
	router.post('/tasks/new', function(req, res, next){
		console.log("POST /admin/task/new");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		let docData = {
			IDControlType: req.body.controlTypeID,
			DocInNum: req.body.docInNum,
			DocDate: 	req.body.docDate,
			IDStatus: req.body.statusID,
			DocOutNum: 	req.body.docOutNum,
			DocTel: 		req.body.docTel,
			IDDocType: 	req.body.docTypeID,
			DocShortContent: req.body.docShortContent
		};
		dbUtils.Doc.create(docData, (dataD) => {
			//res.json({success: true, text: "Doc created"});
			var nNewDocID = dataD.ID;
			let taskData = {
				IDTaskType: req.body.taskTypeID,
				IDDoc: nNewDocID,
				IDStatus: req.body.statusID
			};
			dbUtils.Task.create(taskData, (dataT) => {
				res.json({success: true, text: "Task created"});
			})
		})
	})

	//открытие страницы "localhost:3000/admin/tasks", отображение списка задач
	router.get('/archive/tasks', function(req, res, next) {
		console.log("GET /admin/archive/tasks");
		let sAdminLogin = "",
				sessData = req.session;
		//console.log(sessData);
		if(sessData.admControl){
			sAdminLogin = sessData.admControl.Login;
		}
		else {
			res.redirect('/admin');
			return;
		}
		dbUtils.Task.getArchived((tasks) => {
			if ( !tasks.length ) tasks = [];
			res.render('admintasks', {title: sAdminPageTitle, adminLogin: sAdminLogin, tasksList: tasks, archive: true});
		})
	});

}
