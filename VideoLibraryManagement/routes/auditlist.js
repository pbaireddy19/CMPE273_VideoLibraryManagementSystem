/**
 * New node file
 */
var server = require('../server');

exports.list = function(req, res){
	try
	{
		var moviename = req.param("moviename");
	}
	catch(e)
	{
		console.log(e);
	}
};