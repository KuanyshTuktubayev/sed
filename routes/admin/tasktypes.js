module.exports = (router, dbUtils, sAdminPageTitle) => {

	//это нужно для jquery чтобы проставить значения в выпадающий список поля "тип задач"
	router.get('/tasktypesJson', function(req, res, next) {
		console.log("GET /admin/tasktypesJson");
		dbUtils.TaskType.getNameID((taskTypeList) => {
			res.json(taskTypeList);
		})
	});
	//открытие страницы со списком типа задач
	/*router.get('/tasktypes', function(req, res, next) {
		console.log("GET /admin/tasktypes");
		let sAdminLogin = "",
				sessData = req.session;
		if(sessData.admControl){
      sAdminLogin = sessData.admControl.Login;
    }
		else {
			res.redirect('/admin');
			return;
		}
		dbUtils.TaskType.getAll((taskTypes) => {
			res.render('admintasktypes', {title: sAdminPageTitle, adminLogin: sAdminLogin, taskTypesList: taskTypes});
		})
	});*/
	//если зашли на адрес "localhost:3000/admin/tasktype/123" где 123 это идентификатор типа задачи
	/*router.get('/tasktype/:id', function(req, res, next) {
		console.log("GET /admin/tasktype/id");
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
		dbUtils.TaskType.getByID(nID, (rowTaskTypeData) => {
			res.render('admintasktypeedit', {
				title: sAdminPageTitle,
				adminLogin: sAdminLogin,
				taskTypeData: rowTaskTypeData,
				taskTypeID: nID
			});
		});
	});*/
	//сохранение изменений по типу задач
	// router.post('/tasktype/:id', function(req, res, next) {
	// 	console.log("POST /admin/tasktype/id");
	// 	let sAdminLogin = "",
	// 			sessData = req.session;
	// 	if(sessData.admControl){
  //     sAdminLogin = sessData.admControl.Login;
  //   }
	// 	else {
	// 		res.redirect('/admin');
	// 		return;
	// 	}
	// 	let nID 		      	= req.body.id,
	// 			rowTaskTypeData = {},
	// 			client 		   		= new Client(conOptions);
	// 	client.connect();
	// 	res.send('Тип задач не сохранен!');
	// 	//пока не готово
	// 	var sSQL = `update public."tTaskType" tt set ... where tt."ID" = ${nID}`;
	// 	console.log(sSQL);
	// 	/*client.query(sSQL, (qerr, qres) => {
	// 		if (qerr) {
	// 			console.log(qerr ? qerr.stack : qres);
	// 		}
	// 		else {
	// 			//console.log(qerr ? qerr.stack : qres);
	//
	// 			if (typeof qres.rowCount === 'undefined') {
	// 				console.log('res.rowCount not found');
	// 			}
	// 			else {
	// 				if (qres.rowCount == 0) {
	// 					console.log('res.rowCount='+qres.rowCount);
	// 				}
	// 				else {
	// 					rowTaskData = qres.rows;
	// 				}
	// 			}
	// 		}
	// 		client.end();
	// 		res.render('admintaskedit', {title: sAdminPageTitle, adminLogin: sAdminLogin, taskData: rowTaskData, taskID: nID, taskTypes: taskTypeList});
	// 	});*/
	// });
}
