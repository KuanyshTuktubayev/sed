module.exports = (router, dbUtils, sAdminPageTitle) => {

	//при открытии страницы "localhost:3000/admin"
	router.get('/', function(req, res, next) {
		console.log("GET /admin");
		sessData 	= req.session;
		if(sessData.admControl){
	  	res.redirect('/admin/tasks/');
    }
		else {
			res.redirect('/login');
			}
	});

}
