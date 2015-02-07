/**
 * New node file
 */
/**
 * New node file
 */
var server = require('../server');

exports.listmem = function(req, res){

	try
	{
		console.log("dddddddddd");
		server.dataObject.listallmem(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the  list");
			}
			else
			{
				console.log("ssssssssss");
				server.ejs.renderFile('./views/listallmem.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
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