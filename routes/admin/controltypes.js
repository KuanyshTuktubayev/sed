module.exports = (router, dbUtils, sAdminPageTitle) => {

	//для загрузки списка типа контроля для отображения в выпадающем списке на вебстранице (вызываем в jquery)
	router.get('/controltypesjson', function(req, res, next) {
		console.log("GET /admin/controltypesjson");
		dbUtils.ControlType.getNameID((controlTypeList) => {
			res.json(controlTypeList);
		})
	});
}
