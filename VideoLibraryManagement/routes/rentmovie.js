/**
 * New node file
 */
var server = require('../server');

exports.rent = function(req, res){

	try
	{
		server.dataObject.rentMovie(function(err,results){
			if(err)
			{
				console.log("Error in retrieving the Simple list Members");
			}
			else
			{
				server.ejs.renderFile('./views/simplemembers.ejs',{custDetails:req.session.custDetails,title : "Search Results",searchresults:results},function(err,results)
						{
					if(!err)
					{
						res.end(results);
					}
						});
			}
		},memberId,movieId,copies,currentDate);
	}
	catch(e)
	{
		console.log(e);
	}
};