/**
 * New node file
 */
var server = require('../server');

exports.deletemovie=function(req,res){
	try
	{
		var moviename = req.param("moviename");
		var moviebanner = req.param("moviebanner");
		
		var category = req.param("category");
		

		server.dataObject.deleteMovie(function(err,results){
		if(err)
			{
				console.log("Error in deleting  the movie");
			}
			else
			{
				server.ejs.renderFile('./views/deletemovie.ejs',{custDetails:req.session.custDetails, title: 'Delete Movie',name:req.session.name},function(err,results){
					if(!err)
					{
						res.end(results);
					}
				});
			}

		},moviename,moviebanner,category);
	}
	catch (e)
	{
		console.log(e);
	}
};
