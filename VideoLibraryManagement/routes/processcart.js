/**
 * New node file
 */
var server = require('../server');

exports.process = function(req, res){

	try
	{
		if(req.param("submit") == "remove")
		{
			for(var i=0;i<req.session.cartitems.length;i++)
			{
				if((req.param(req.session.cartitems[i].movid)!=null) && (req.param(req.session.cartitems[i].movid)=="checked"))
				{
					req.session.cartitems.splice(i,1);
				}
			}

			server.ejs.renderFile('./views/moviecart.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems},function(err,results)
					{
				if(!err)
				{

					res.end(results);
				}
					});
		}
		else if(req.param("submit") == "rent")
		{
			var cartMovies = req.session.cartitems;
			var memId = req.session.custDetails[0].memberid;
			var type = req.session.custDetails[0].type;

			if(type === "simple")
			{
				server.dataObject.simpleMemMovieCount(function(err,results){
					if(err)
					{
						console.log("Error in getting the MovieCount");
					}
					else
					{
						var holdingMovies = results[0].moviesno;
						console.log("HOLDING Movies:" + (holdingMovies + req.session.cartitems.length));
						if((holdingMovies + req.session.cartitems.length) > 2)
						{
							server.ejs.renderFile('./views/moviecart.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems,err:"You are not allowed to rent more than 2 Videos"},function(err,results)
									{
								if(!err)
								{
									res.end(results);
								}
									});
						}
						else
						{
							var amountdue = 0;
							for(var i=0;i<req.session.cartitems.length;i++)
							{
								var copies = req.session.cartitems[i].requestedcopies;
								console.log("COPIES:" + copies);
								 server.dataObject.getRentAmount(function(err,results){
									 console.log("!!!!!!!!" +results[0].rentamount); 
									 amountdue = parseFloat(amountdue) + (parseFloat(results[0].rentamount) * parseFloat(copies));
									 console.log("AMOUNT DUE:" + amountdue);
										server.ejs.renderFile('./views/payment.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems,amount:amountdue},function(err,results)
												{
											if(!err)
											{

												res.end(results);
											}
												});
								 },req.session.cartitems[i].movid);
							}	
						}
					}

				},memId);
			}
			else if(type === "premium")
			{

				server.dataObject.getMemShipDate(function(err,results){
					if(err)
					{
						console.log("Error in retrieving the movie");
					}
					else
					{
						var now = server.moment(new Date());
						var memDate = results[0].memdate;
						console.log("MembershipDate:" + memDate);
						if(server.moment((now.format("YYYY/MM/DD"))).diff(memDate, 'days') > 30)
						{
							server.ejs.renderFile('./views/moviecart.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems,err:"Your MemberShip Expired"},function(err,results)
									{
								if(!err)
								{

									res.end(results);
								}
									});
						}
						else
						{
							server.dataObject.premiumMemMovieCount(function(err,results){
								if(err)
								{
									console.log("Error in getting the MovieCount");
								}
								else
								{
									var holdingMovies = results[0].moviesno;
									console.log("HOLDING Movies:" + (holdingMovies + req.session.cartitems.length));
									if((holdingMovies + req.session.cartitems.length) > 10)
									{
										server.ejs.renderFile('./views/moviecart.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems,err:"You are not allowed to rent more than 10 Videos"},function(err,results)
												{
											if(!err)
											{
												res.end(results);
											}
											else
											{
												var now = server.moment(new Date());
												server.dataObject.updatePremiumtable();

											}
												});
									}
									else
									{
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
										server.dataObject.updatePremiumtable(function(err,results){
											if(err)
											{
												console.log('error');
											}
											else
											{
												var amountdue = 0;
												for(var i=0;i<req.session.cartitems.length;i++)
												{
													var copies = req.session.cartitems[i].requestedcopies;
													console.log("COPIES:" + copies);
													 server.dataObject.getRentAmount(function(err,results){
														 console.log("!!!!!!!!" +results[0].rentamount); 
														 amountdue = parseFloat(amountdue) + (parseFloat(results[0].rentamount) * parseFloat(copies));
														 console.log("AMOUNT DUE:" + amountdue);
															server.ejs.renderFile('./views/premiumamount.ejs',{custDetails:req.session.custDetails,title : "Movie Cart",cartitems:req.session.cartitems,amount:amountdue},function(err,results)
																	{
																if(!err)
																{

																	res.end(results);
																}
																	});
													 },req.session.cartitems[i].movid);
												}	
											}

										},memId,movids,copies,date);
									}
								}

							},memId);
						}
					}
				},memId);
			}
		}
	}
	catch(e)
	{
		console.log(e);
	}
};