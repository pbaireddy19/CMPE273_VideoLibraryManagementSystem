/**
 * New node file
 */
var server = require('../server');

exports.fullsearch = function(req, res){
	try
	{
		server.dataObject.listAllMovies(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the movie");
			}
			else
			{
				server.ejs.renderFile('./views/displayallmovies.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}
		});
	}
	catch (e)
	{
		console.log(e);
	}
};
