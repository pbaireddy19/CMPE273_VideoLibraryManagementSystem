/**
 * New node file
 */
var server = require('../server');

exports.pay = function(req, res){

	try
	{
		for(var i=0;i<req.session.cartitems.length;i++)
		{
			req.session.cartitems.pop();
		}
		server.ejs.renderFile('./views/success.ejs',{custDetails:req.session.custDetails,title : "Payment Succeful"},function(err,results)
				{
			if(!err)
			{

				res.end(results);
			}
				});
	}
	catch(e)
	{
		console.log(e);
	}
};