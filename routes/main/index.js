module.exports = (router, dbUtils) => {
	//страница авторизации
	router.get('/', function(req, res, next){
		console.log("GET /");
		var sessData = req.session;
		if ( sessData.admControl ) {
			res.redirect('/admin/tasks/')
		}
		else {
			res.redirect('/admin/');
		}
	})
}
