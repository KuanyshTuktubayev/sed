module.exports = (router, dbUtils, sAdminPageTitle) => {

	//для загрузки списка типа документов для отображения в выпадающем списке на вебстранице (вызываем в jquery)
	router.get('/doctypesjson', function(req, res, next) {
		console.log("GET /admin/doctypesjson");
		dbUtils.DocType.getNameID((docTypeList) => {
			res.json(docTypeList);
		})
	});
}
