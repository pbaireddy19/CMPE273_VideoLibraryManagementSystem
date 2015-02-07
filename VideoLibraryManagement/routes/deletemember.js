/**
 * New node file
 */
var server = require('../server');

exports.deleteMember=function(req,res){
	try
	{
		var firstname = req.param("firstname");
		var lastname = req.param("lastname");
		
		var memID = req.param("memid");
		var type = req.param("memtype");

		server.dataObject.deleteMember(function(err,results){
		if(err)
			{
				console.log("Error in deleting  the member");
			}
			else
			{
				server.ejs.renderFile('./views/searchmemberresults.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results){
					if(!err)
					{
						res.end(results);
					}
				});
			}

		},firstname,lastname,memID,type);
	}
	catch (e)
	{
		console.log(e);
	}
};
