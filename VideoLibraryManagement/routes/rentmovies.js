/**
 * New node file
 */
var server = require('../server');

exports.search = function(req, res){
	try
	{
		var movieName = req.param("moviename");
		var movieBanner = req.param("moviebanner");
		var releaseDate = req.param("releasedate");
		var category = req.param("category");

		server.dataObject.searchMovie(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the movie");
			}
			else
			{
				server.ejs.renderFile('./views/rentmovies.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results,name:req.session.name},function(err,results)
						{
					if(!err)
					{

						res.end(results);
					}
						});
			}

		},movieName,movieBanner,category,releaseDate);
	}
	catch (e)
	{
		console.log(e);
	}
};