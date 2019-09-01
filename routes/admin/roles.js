module.exports = (router, dbUtils, sAdminPageTitle) => {
	router.get('/rolesJson', function(req, res, next) {
		console.log("GET /rolesjson");
		dbUtils.Role.getNameID((roleList) => {
			res.json(roleList);
		})
	});
}
