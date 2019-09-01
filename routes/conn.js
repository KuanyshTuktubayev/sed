//-------------------
const { Client } = require('pg');
const conOptions = {
	user: 'sedadmin',
	password: 'qwe123',
	host: 'localhost',
	database: 'SEDDB',
	port: 5432,
};
//-------------------

module.exports = {
	connClient: Client,
	conOptions: conOptions
}
