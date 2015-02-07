/**
 * New node file
 */
var server = require('../server');

exports.listsmem = function(req, res){

	try
	{
		server.dataObject.listAllSimple(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the Simple list Members");
			}
			else
			{
				server.ejs.renderFile('./views/simplemembers.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
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