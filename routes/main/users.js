let passwordHash = require('password-hash');

module.exports = (router, dbUtils) => {
	//выход из сессии
	router.get('/exit', function(req, res) {
		console.log("get: /exit");
		req.session.destroy(function(err) {
			if (err) { throw err; }
		});
		res.redirect('/');
	});
	router.get('/login', function(req, res) {
		console.log("get: /login");
		var sessData = req.session;
		if ( sessData.admControl ) {
			res.redirect('/admin/users/');
		}
		else {
			res.render('login', { title: "Авторизация", errorMsg: "", testMsg: passwordHash.generate("12345678") });
		}
	});
	router.post('/login', function(req, res) {
		console.log('post: /login');
		var sessData = req.session;
		//var hashedPassword = passwordHash.generate(req.body.txPassword);
		dbUtils.Users.login({login: req.body.txLogin}, (data) => {
			if (!data) {
				sessData.errorMsg = "Неверный логин";
				res.redirect('/login');
				return;
			}
			console.log('data.Login='+data.Login+', data.Pwd='+data.Pwd);
			if (passwordHash.verify(req.body.txPassword, data.Pwd)) {
				console.log('user found:');
				console.log(data);
				sessData.userLogin = data.Login;
				sessData.userID = data.ID;
				// 1 роль - админ
				if ( data.IDRole == 1 ) {
					sessData.admControl = {
						ID: data.ID,
						Login: data.Login,
						IDRole: data.IDRole
					};
					res.redirect('/admin/users');
				}
			}
			else {
				sessData.errorMsg = "Неверный пароль";
				res.redirect('/login');
			}
		})
	})
}
