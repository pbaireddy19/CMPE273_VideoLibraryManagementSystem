/**
 * New node file
 */
var server = require('../server');

exports.pay = function(req, res){
	try
	{
		var cardNo =  req.param("cardno");
		var cvv = req.param("cvv");
		var memId = req.session.custDetails[0].memberid;
		var now = server.moment(new Date());
		var movids = [];
		var copies = [];
		console.log("IN CREDIT CARD-LENGTH:" + req.session.cartitems.length);
		for(var i=0;i<req.session.cartitems.length;i++)
		{
			console.log("IN CREDIT CARD-MOVID:" + req.session.cartitems[i].movid);
			movids.push(req.session.cartitems[i].movid);
			copies.push(req.session.cartitems[i].requestedcopies);
		}
		var date = now.format("YYYY/MM/DD") + " " + now.format("HH:mm:ss");
		console.log(date);
		server.dataObject.updateSimpletable(function(err,results){
			if(err)
			{
				console.log('error');
			}
			else
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

		},cardNo,cvv,memId,movids,copies,date);
	}
	catch (e)
	{
		console.log(e);
	}
};