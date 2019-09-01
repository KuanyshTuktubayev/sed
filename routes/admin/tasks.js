module.exports = (router, dbUtils, sAdminPageTitle) => {
	//открытие страницы "localhost:3000/admin/tasks", отображение списка задач
	router.get('/tasks', function(req, res, next) {
		console.log("GET /admin/tasks");
		let sAdminLogin = "",
				sessData = req.session;
		console.log(sessData);
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
	//открытие страницы редактирования одного мероприятия "localhost:3000/admin/task/123", где 123 это идентификатор задачи
	router.get('/task/:id', function(req, res, next) {
		let sAdminLogin = "",
				sessData = req.session;
		console.log("GET /admin/task/id");
		if(sessData.admControl){
			sAdminLogin = sessData.admControl.Login;
		}
		else {
			res.redirect('/admin');
			return;
		}
		let nID = req.params.id,
				rowTaskData = {},
				taskTypeList = {};
		dbUtils.Task.getById(nID, (rowTaskData, qres) => {
			console.log('rowTaskData.IDTasktype='+rowTaskData.IDTasktype);
			dbUtils.Tasktype.getNameID((taskTypeList) => {
				if (typeof rowTaskData.IDTasktype === 'undefined') {
					//do nothing
				}
				res.render('admintaskedit', {
					title: sAdminPageTitle,
					adminLogin: sAdminLogin,
					taskData: rowTaskData,
					taskID: nID,
					taskTypes: taskTypeList
				});
			});
		});
	});
	//сохранение изменений мероприятия
	router.post('/task/:id', function(req, res, next) {
		let sAdminLogin = "",
				sessData = req.session;
		console.log("POST /admin/task/id");
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		if(!req.body){
			console.log("req.body is null. Redirect to event/id...");
			res.send('req.body is null');
			return;
		}
		let taskData = {
			nID:						req.params.id,
			sPostOperation: req.body.postOperation,
			nTasktypeID: 		req.body.tasktypeID,
			nStatusID:    	req.body.statusID
		};
		dbUtils.Task.update(taskData, (sResMsg) => {
			res.send(sResMsg);
		})
	});
	router.get('/taskGetStatus/:id', function(req, res, next){
		let nID = req.params.id;
		dbUtils.Task.getStatus(nID, (rowTaskData) => {
			res.json(rowTaskData);
		})
	});
	router.get('/task/archive/:id', function(req, res, next){
		let sAdminLogin = "",
				sessData = req.session;
		console.log("POST /admin/task/id");
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
		dbUtils.Tasktype.getNameID((taskTypes) => {
			if (taskTypes.length > 0) {
				res.render('admintasknew', {
					title: sAdminPageTitle,
					adminLogin: sAdminLogin,
					tasktypes: taskTypes
				});
			}
			else {
				res.render('admintasknew', {
					title: sAdminPageTitle,
					adminLogin: sAdminLogin,
					tasktypes: [{ID: 0, Name: "Неизвестно"}]
				});
			}
		})
	})
	router.post('/tasks/new', function(req, res, next){
		let sAdminLogin = "",
				sessData = req.session;
		console.log("POST /admin/task/id");
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		let taskData = {
			IDTasktype: req.body.tasktypeID,
			IDStatus:		1
		};
		dbUtils.Task.create(taskData,(data) => {
			res.json({success: true, text: "Task created"});
		})
	})
	//открытие страницы "localhost:3000/admin/tasks", отображение списка задач
	router.get('/archive/tasks', function(req, res, next) {
		console.log("GET /admin/archive/tasks");
		let sAdminLogin = "",
				sessData = req.session;
		console.log(sessData);
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
