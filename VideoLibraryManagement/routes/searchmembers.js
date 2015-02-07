/**
 * New node file
 */
var server = require('../server');

exports.searchmember = function(req, res){
	try
	{
		var fName = req.param("firstname");
		var lName = req.param("lastname");
		var memid = req.param("memid");
		var memtype = req.param("memtype");
		var address = req.param("address");
		var city = req.param("city");
		var state = req.param("state");
		var zipcode = req.param("zipcode");
		var country = req.param("country");
		
		server.dataObject.searchPerson(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the person");
			}
			else
			{
				server.ejs.renderFile('./views/searchmemberresults.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
						{
					if(!err)
					{

						res.end(results);
					}
						});
			}

		},fName,lName,memid,memtype,address,city,state,zipcode,country);
	}
	catch(e)
	{
		console.log(e);
	}
};