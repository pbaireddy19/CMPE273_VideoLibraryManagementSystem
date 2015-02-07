/**
 * New node file
 */
var server = require('../server');

exports.editprofile = function(req, res){

	try
	{
		var firstname = req.param("firstname");
		var lastname = req.param("lastname");
		var memtype = req.param("memtype");
		var memid = req.param("memid");
		var address = req.param("address");
		var city = req.param("city");
		var state = req.param("state");
		var zipcode = req.param("zipcode");
		var country = req.param("country");
		
		console.log("FFFFFFFF" + firstname);
		
		
		
		server.dataObject.updateProfile(function(err,results){
			if(err)
			{
				console.log("Error in updating the profile");
				server.ejs.renderFile('./views/personalprofile.ejs',{custDetails:req.session.custDetails,title : "ProfileUpdate",err:"Failed to update the profile",name:req.session.name},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}
			else
			{
				server.ejs.renderFile('./views/personalprofile.ejs',{custDetails:req.session.custDetails,title : "ProfileUpdate",msg:"Profile updated Successfully",name:req.session.name},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}
		},firstname,lastname,memtype,memid,address,city,state,zipcode,country);
	}
	catch(e)
	{
		console.log(e);
	}
};