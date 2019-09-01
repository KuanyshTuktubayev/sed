var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var sessData = req.session;
	if ( sessData.admControl ){
		res.redirect('/admin');
	}
	else {
		res.redirect('/admin');
	}
});

module.exports = router;
