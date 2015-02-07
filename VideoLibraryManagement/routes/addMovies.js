/**
 * New node file
 */
var server = require('../server');

exports.add=function(req,res){
	try
	{
		var movieName = req.param("moviename");
		var movieBanner = req.param("moviebanner");
		var releaseDate = req.param("releasedate");
		var category = req.param("category");
		var copies = req.param("copies");

		server.dataObject.addMovies(function(err,results){
		if(err)
			{
				console.log("Error in adding the movie");
			}
			else
			{
				server.ejs.renderFile('./views/addmovie.ejs',{custDetails:req.session.custDetails, title: 'Add Movie',name:req.session.name},function(err,results){
					if(!err)
					{
						res.end(results);
					}
				});
			}

		},movieName,movieBanner,category,releaseDate,copies);
	}
	catch (e)
	{
		console.log(e);
	}

};