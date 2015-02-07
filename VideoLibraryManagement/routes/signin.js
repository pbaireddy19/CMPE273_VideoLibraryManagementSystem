/**
 * New node file
 */

var server = require('../server');

exports.login = function(req, res){

	try
	{
		var userName = req.param("email");
		var password = req.param("password");
		console.log(userName);
		console.log(password);

		if((userName != null) && (password != null))
		{
			server.dataObject.signIn(function(err,results){
				if(err)
				{
					console.log('Invalid UserName/Password');
					server.ejs.renderFile('./views/index.ejs',{err:'Invalid Username/Password',title:"Login"},function(err,results)
							{
						if(!err)
						{
							console.log("InValid User");
							res.end(results);
						}
							});
				}
				else
				{
					console.log("Valid User");
					//TODO: Check for admin

					//Storing User details into Session
					req.session.custDetails = results;
					req.session.name = results[0].firstname;
					console.log("The session is " + req.session.name);
					console.log("AAAAA:" + results[0].username);
					if(results[0].type != "admin")
					{
						server.ejs.renderFile('./views/home.ejs',{custDetails:results,title : "Home",name: req.session.name},function(err,results)
								{
							if(!err)
							{
								console.log("Valid User");
								res.end(results);
							}
								});
					}
					else
					{
						server.ejs.renderFile('./views/admin.ejs',{custDetails:results,title : "Home",name: req.session.name},function(err,results)
								{
							if(!err)
							{
								console.log("Admin");
								res.end(results);
							}
								});
					}
				}
			},userName,password);
		}
		else
		{
			console.log("UserName/Password cannot be empty");
		}
	}
	catch (e)
	{
		console.log("Error " + e);
	}
};