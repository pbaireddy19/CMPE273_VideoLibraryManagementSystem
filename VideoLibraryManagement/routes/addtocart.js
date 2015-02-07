/**
 * New node file
 */
var server = require('../server');

exports.addmovie = function(req, res){

	try
	{
		console.log("In ADD to Cart");
		var count = req.param("totalmoviecount");

		for(var i=0;i<count;i++)
		{
			if((req.param("check"+i)!=null) && (req.param("check"+i)=="checked"))
			{
				
				var movid = req.param("movid"+i);
				var movname = req.param("movname"+i);
				var movbanner = req.param("movbanner"+i);
				var category = req.param("category"+i);
				var releasedate  = req.param("releasedate"+i);
				var noofcopies = req.param("noofcopies"+i);
				var requestedcopies = req.param("requestedcopies"+i);
				
				
				console.log("movname:" + movname);
				console.log("reqcopies:" + requestedcopies);
				if(!req.session.cartitems)
				{
					req.session.cartitems = [];
				}

				var item = {
						movid: movid,
						movname:movname,
						movbanner:movbanner,
						category:category,
						releasedate:releasedate,
						noofcopies:noofcopies,
						requestedcopies:requestedcopies,
				};
				req.session.cartitems.push(item);
				server.ejs.renderFile('./views/moviecart.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems},function(err,results)
						{
					if(!err)
					{

						res.end(results);
					}
						});
			}
		}
	}
	catch(e)
	{
		console.log(e);
	}
};