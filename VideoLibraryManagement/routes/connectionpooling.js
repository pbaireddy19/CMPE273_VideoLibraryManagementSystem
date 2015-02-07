/**
 * New node file
 */

var server = require('../server');
var connPool = [];

function connect()
{
	try
	{
		var connection = server.sql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'admin',
			port: '3306',
			database: 'svlm1'
		});

		connection.connect();

		return connection;
	}
	catch(e)
	{
		console.log("Error in connecting to the database" + e);
		return null;
	}
}

function initializepool(connections)
{
	for (var i = 0; i < connections; i++)
	{
		connPool.push(connect());
	}
}

function getConnection()
{
	if(connPool.length >=1 )
	{
		return connPool.pop();
	}
}

function returnConnection(connection)
{
	connPool.push(connection);
}

exports.initializepool = initializepool;
exports.getConnection = getConnection;
exports.returnConnection = returnConnection;