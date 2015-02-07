/**
 * New node file
 */
var server = require('../server');

exports.listpmem = function(req, res){

	try
	{
		server.dataObject.listAllPremium(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the premium list");
			}
			else
			{
				server.ejs.renderFile('./views/premiummembers.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}
		});
	}
	catch(e)
	{
		console.log(e);
	}
};