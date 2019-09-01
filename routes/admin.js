let express 	= require('express'),
	router  		= express.Router(),
	requireFu 	= require('require-fu'),
	dbUtils 		= require(`${__basedir}/database/DatabaseUtils.js`),		// Управление бд
	sAdminPageTitle = 'Система электронного документооборота';

requireFu(__dirname + '/admin')(router, dbUtils, sAdminPageTitle);					// подключение всего админ роутинга из /admin/

module.exports = router;
