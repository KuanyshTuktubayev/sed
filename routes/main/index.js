module.exports = (router, dbUtils) => {
	//страница авторизации
	router.get('/', function(req, res, next){
		console.log("get: /");
		var sessData = req.session;
		if ( sessData.admControl ) {
			res.redirect('/admin/users/')
		}
		else {
			res.redirect('/admin/');
		}
	})
}
