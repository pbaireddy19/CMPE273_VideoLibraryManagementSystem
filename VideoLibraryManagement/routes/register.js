/**
 * New node file
 */
var server = require('../server');

exports.register = function(req, res){
	try
	{
		var fname= req.param("firstname");
		var lname= req.param("lastname");
		var memtype= req.param("memtype");
		var memid= req.param("memid1");
		var email = req.param("email");
		var password = req.param("password");
		var address = req.param("address");
		var city = req.param("city");
		var state = req.param("state");
		var zipcode = req.param("zipcode");
		
		var country = req.param("country");

		var now = server.moment(new Date());
		var date = now.format("YYYY/MM/DD");

		server.dataObject.createMember(function(err,results)
				{
			if(err)
			{
				server.ejs.renderFile('./views/signup.ejs',{msg:err ,title : "Signup"},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}else
			{

			}
				},fname,lname,memtype,address,city,state,zipcode,memid,date,country,email,password,date + now.format("HH:MM:SS"));
	}
	catch(e)
	{

	}
};
