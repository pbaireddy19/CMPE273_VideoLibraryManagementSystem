/**
 * New node file
 */
var server = require('../server');
var connection;

function signIn(callback,userName,password)
{
	connection = server.poolObject.getConnection();
	var result = "";
	var rowCount = 0;

	try
	{
		var query = "Select l.logintime,l.username,p.firstname as firstname,p.lastname,p.type as type,l.password as password,p.address,p.city,p.state,p.zipcode,p.country,p.memberid from login l,person p where username='" + userName + "' AND p.personid=l.personid ";
		if(connection != null)
		{
			connection.query(query,function(error,rows,fields){
				if (error)
				{
					console.log("ERROR: " + error.message);
				}
				else
				{
					if(rows.length!==0)
					{

						if(password===rows[0].password){
							/*	client.set("string key", "Welcome to Redis World", function (err, reply) {
							if(!err)
							{
								console.log(reply.toString());
							}
							else
							{
								console.log(err);
							}
						});*/

							var now = server.moment(new Date());
							updateLoggedInfo(userName,now.format("YYYY/MM/DD") + now.format("HH:MM:SS"));
							console.log("DATA : "+JSON.stringify(rows));
							callback(error, rows);
						}
						else
						{
							var err="Invalid UserName/Password"
								console.log("password does not match");
							callback(err);
						}
					}
					else
					{
						var err="Invalid UerName/Password";
						console.log("returned 0 rows");
						callback(err);
					}
				}

			});

		}
		else
		{
			console.log('Unable to get the Database Connection');
		}
	}
	catch (e)
	{
		console.log("Error:" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function updateLoggedInfo(userName, loginTime)
{
	try
	{
		connection = server.poolObject.getConnection();
		var pQuery = "UPDATE login SET logintime='" + loginTime +  "'" + "WHERE username='" + userName + "'";

		connection.query(pQuery,function(perr,pRows,pFields){
			if(perr)
			{
				console.log("ERROR: " + perr.message);
			}
			else
			{
				console.log("LoginTime Updated");
			}
		});

	}
	catch(e)
	{
		console.log("Error in updating the Login Time");
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function createMember(callback,fName,lName,mType,address,city,state,zipcode,memberid,mdate,country,email,password,logintime)
{
	try
	{
		connection = server.poolObject.getConnection();

		var mQuery = "Select * from person where memberid= '" + memberid +  "'";
		connection.query(mQuery,function(perr,pRows,pFields){
			if(perr)
			{
				console.log("ERROR: " + perr.message);
				callback(perr);
			}
			else
			{
				if(pRows.length == 0)
				{
					var eQuery = "Select * from login where username='" + email +  "'";
					connection.query(eQuery,function(perr,pRows,pFields){
						if(perr)
						{
							console.log("ERROR: " + perr.message);
							callback(perr);
						}
						else
						{
							console.log("LoginTime Updated");
							if(pRows.length == 0)
							{
								var pQuery = "Insert into person (firstname,lastname,type,address,city,state,zipcode,memberid,country) values('" + fName + "','" + lName + "','" + mType + "','" + address + "','" + city + "','" + state + "','" + zipcode + "','" + memberid + "','" + country + "')";
								connection.query(pQuery,function(perr,pRows,pFields){
									if(perr)
									{
										console.log("ERROR: " + perr.message);
										callback(perr);
									}
									else
									{
										var query = "Select personid,type from person where memberid='" + memberid + "' ";
										connection.query(query,function(perr,pRows,pFields){
											if(perr)
											{
												console.log("ERROR: " + perr.message);
												callback(perr);
											}
											else
											{
												var personid = pRows[0].personid;
												var memtype = pRows[0].type;

												var lQuery = "Insert into login(personid,username,password,logintime) values('" + personid + "','" + email + "','" + password + "','" + logintime + "')";
												connection.query(lQuery,function(perr,pRows,pFields){
													if(perr)
													{
														console.log("ERROR: " + perr.message);
														callback(perr);
													}
													else
													{
														if(memtype == "simple")
														{
															var sQuery = "Insert into simplemember(smemberid,personid,balancedue,moviesno) values('" + memberid + "','" + personid + "','0','0')";
															connection.query(sQuery,function(perr,pRows,pFields){
																if(perr)
																{
																	console.log("ERROR: " + perr.message);
																	callback(perr);
																}
																else
																{
																	callback("Signup Successfull.Please login to continue");
																}
															});

														}
														else if(memtype == "premium")
														{
															var sQuery = "Insert into premiummember(pmemberid,personid,moviesno,memdate) values('" + memberid + "','" + personid + "','0','" + mdate + "')";
															connection.query(sQuery,function(perr,pRows,pFields){
																if(perr)
																{
																	console.log("ERROR: " + perr.message);
																	callback(perr);
																}
																else
																{
																	callback("Signup Successfull.Please login to continue");
																}
															});
														}
													}
												});
											}
										});
									}
								});
							}
							else
							{
								callback("Member already exists with the E-mail "+email);
							}
						}
					});			
				}
				else
				{
					callback("Member already exists with the MembershipID " + memberid);
				}
			}
		});
	}
	catch(e)
	{
		console.log("Error in creating Member");
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function searchMovie(callback,movieName,movieBanner,category,releaseDate)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT * FROM movies WHERE (movname LIKE IFNULL('%" + movieName + "%'" + ",movname))  AND (movbanner LIKE IFNULL('%" + movieBanner + "%'" + ",movbanner)) AND (category LIKE IFNULL('%" + category + "%'" + ",category)) and (releasedate LIKE IFNULL('%" + releaseDate + "%'" + ",releasedate)) ";
		console.log(query);
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
					console.log("MovieSearch Successful");
				}
				else
				{
					console.log("No Movies returned on the search criteria");
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in Searching Movies" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function listAllMovies(callback)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT * from movies limit 100";
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
					console.log("Full MovieSearch Successful");
				}
				else
				{
					console.log("No Movies returned");
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in fetching Movies" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function listAllPremium(callback)
{
	var memType = "premium";

	try
	{
		server.client.get("premiummembers",function(err,reply)
				{

			if(reply==null)
			{
				connection = server.poolObject.getConnection();
				var query = "SELECT personid,firstname,lastname,address,city,state,zipcode,memberid,country FROM person WHERE type='"+ memType +"' limit 1000";
				connection.query(query,function(err,rows,pFields){
					if(err)
					{
						console.log("ERROR: " + err.message);
						callback(err);
					}
					else
					{
						if(rows.length!==0)
						{
							console.log("DATA : "+JSON.stringify(rows));

							//Caching the Premium Members in Redis
							server.client.set("premiummembers",JSON.stringify(rows),function(err,reply){
								if(!err)
								{
									server.client.expire("premiummembers",1800);
								}
							});

							callback(err, rows);
							console.log("Fetching Premium Members Successful");
						}
						else
						{
							console.log("No Premium Members returned");
						}
					}
				});
			}
			else
			{
				console.log("Fetching data from cache");
				callback(err,JSON.parse(reply));

			}
				});
	}
	catch (e)
	{
		console.log("Error in fetching Premium Members" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}

}



function listAllSimple(callback)
{
	var memType = "simple";

	try
	{
		server.client.hmget("simplemembers", function (err, reply) {
			if(reply != null)
			{
				callback(err,reply);
			}
			else
			{
				connection = server.poolObject.getConnection();
				var query = "SELECT * FROM person WHERE type='"+ memType +"'";
				connection.query(query,function(err,rows,pFields){
					if(err)
					{
						console.log("ERROR: " + err.message);
						callback(err);
					}
					else
					{
						if(rows.length!==0)
						{
							console.log("DATA : "+JSON.stringify(rows));
							server.client.hmset("simplemembers", JSON.stringify(rows), function (err, reply) {
								if(!err)
								{
									console.log("Cached Simple Customers List");
								}
								else
								{
									console.log(err);
								}
							});
							callback(err, rows);
							console.log("Fetching Simple Members Successful");
						}
						else
						{
							console.log("No Simple Members returned");
						}
					}
				});
			}
		});
	}
	catch (e)
	{
		console.log("Error in fetching Simple Members" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function searchPerson(callback,firstName,lastName,memId,memType,address,city,state,zipCode,country)
{
	try
	{
		connection = server.poolObject.getConnection();
		console.log("type"+memType);
		console.log("address"+address);
		var query = "SELECT personid,firstname,lastname,type,address,city,state,zipcode,memberid,country FROM person WHERE firstname LIKE IFNULL('%" + firstName +  "%',firstname) and lastname LIKE IFNULL('%" + lastName +  "%',lastname) and  type LIKE IFNULL('%" + memType +  "%',type)  and address LIKE IFNULL('%" + address +  "%',address)  and city LIKE IFNULL('%" + city +  "%',city) and  state LIKE IFNULL('%" + state +  "%',state) and  zipcode LIKE IFNULL('%" + zipCode +  "%',zipcode) and (memberid LIKE IFNULL('%" + memId +  "%',memberid) and country LIKE IFNULL('%" + country +  "%',country) ) limit 100 ";
		console.log(query);
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
					console.log("search Member Successful");
				}
				else
				{
					console.log("No Members based on the search criteria");
					callback(err, rows);
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in fetching Simple Members" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function addMovies(callback,movieName,movieBanner,category,releaseDate,copies)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "Select * from movies where movname= '" + movieName +  "'";
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				callback(err);
			}
			else
			{
				if(rows.length==0)
				{

					var aQuery = "INSERT INTO movies(movname,movbanner,releasedate,category,noofcopies) VALUES('" + movieName +  "','" + movieBanner +  "','" + releaseDate +  "','" + category +  "','" + copies +  "')";
					connection.query(aQuery,function(err,rows,pFields){
						if(err)
						{
							console.log("ERROR: " + err.message);
							callback(err);
						}
						else
						{
							if(rows.length!==0)
							{
								console.log("DATA : "+JSON.stringify(rows));
								callback(err, rows);
								console.log("Successfully added the movie " + movieName);
							}
							else
							{
								console.log("Error in Adding the Movie " + movieName);
								callback(err, rows);
							}
						}
					});
				}
				else
				{
					console.log("Movie with theName" + movieName + "already exists!!!");
					err = "Movie with theName" + movieName + "already exists!!!";
					callback(err, rows);
				}
			}
		});
	}
	catch (e)
	{
		console.log("Failed to add Movie" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function deleteMovie(callback,moviename,moviebanner,category){
	try
	{connection = server.poolObject.getConnection();
	var query = "Select * from movies where movname= '" + moviename +  "'";
	connection.query(query,function(err,rows,pFields){
		if(err)
		{
			console.log("ERROR: " + err.message);
			callback(err);
		}
		else
		{ 
			if(rows.length!==0)
			{
				console.log(moviename);
				console.log(moviebanner);
				console.log(category);

				var aQuery = "delete from movies where movname='"+ moviename +"' and movbanner='"+ moviebanner +"' and category='"+ category +"'";
				connection.query(aQuery,function(err,rows,pFields){
					if(err)
					{
						console.log("ERROR: " + err.message);
						callback(err);
					}
					else
					{
						if(rows.length!==0)
						{
							console.log("DATA : "+JSON.stringify(rows));
							callback(err, rows);
							console.log("Successfully deleted the movie " + moviename);
						}
						else
						{
							console.log("Error in deleting the Movie " + moviename);
							callback(err, rows);
						}
					}
				});
			}
			else
			{
				console.log("Movie with theName" + moviename + "does not exist!!!");
				err = "Movie with theName" + moviename + "does not  exist!!!";
				callback(err, rows);
			}

		}
	});
	}catch (e)
	{
		console.log("Failed to delete the Movie" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function simpleMemMovieCount(callback,memid)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT moviesno FROM simplemember WHERE smemberid='" + memid +  "'";
		connection.query(query,function(error,rows,fields){
			if (error)
			{
				console.log("ERROR: " + error.message);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(error, rows);
				}
				else
				{
					console.log("returned 0 rows");
					callback(error);
				}
			}

		});
	}
	catch (e)
	{
		console.log("Error in getting simpleMembers Movie Count" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}
function premiumMemMovieCount(callback,memid)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT moviesno FROM premiummember WHERE pmemberid='" + memid +  "'";
		connection.query(query,function(error,rows,fields){
			if (error)
			{
				console.log("ERROR: " + error.message);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(error, rows);
				}
				else
				{
					console.log("returned 0 rows");
					callback(error);
				}
			}

		});
	}
	catch (e)
	{
		console.log("Error in getting simpleMembers Movie Count" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function getMemShipDate(callback,memid)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT memdate FROM premiummember WHERE pmemberid='" + memid +  "'";
		connection.query(query,function(error,rows,fields){
			if (error)
			{
				console.log("ERROR: " + error.message);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(error, rows);
				}
				else
				{
					console.log("returned 0 rows");
					callback(error);
				}
			}

		});
	}
	catch (e)
	{
		console.log("Error in getting simpleMembers Movie Count" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function getRentAmount(movId)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT rentamount from movies WHERE movid='" + movId +  "'";
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				//callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					return rows[0].rentamount;
				}
				else
				{
					console.log("No Movies returned on the search criteria");
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in updating Simple table" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}

}


function listallmem(callback)
{


	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT personid,firstname,lastname,address,city,state,zipcode,memberid,country FROM person limit 100";
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);
					console.log("Fetching All Members Successful");
				}
				else
				{
					console.log("No  Members returned");
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in fetching Members" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}

}



exports.listallmem=listallmem;
exports.deleteMovie=deleteMovie;
function updateSimpleTable(callback,cardNo, cvv,memid,movIds, copies, date)
{
	try
	{
		connection = server.poolObject.getConid;
		var movieCount = 0;
		var balanceDue;
		var transID;
		var existingcopies;
		//var query = "SELECT type FROM `person` WHERE member;
		if((cardNo != null) && (cvv != null))
		{
			for(var i=0;i<movIds.length;movIds++)
			{

				movieCount = parseInt(movieCount,10) + parseInt(copies[i],10);

				balanceDue = parseFloat(balanceDue) + parseFloat(copies[i]) * parseFloat(getRentAmount(movIds[i]));


				console.log("MOVIE NO FROM DATA:" + movIds);
				getMovieCopiesNumer(function(err,results){
					if(err)
					{

					}
					else
					{
						console.log("{}{}{}" + results[0].noofcopies);
						existingcopies = results[0].noofcopies;


						console.log("COPIES---:" + copies[i]);
						console.log("ECP" + existingcopies);
						var noofcopies = parseInt(existingcopies) - parseInt(copies[i]);
						console.log("NOC:" + noofcopies);
						console.log("Test" + movIds[i]);
						console.log("Test111" + movIds[0]);
						var query = "UPDATE movies SET noofcopies='" + parseInt(noofcopies) + "' WHERE movid='" + parseInt(movIds[i]) +  "'";
						console.log("_________()()()" + query);
						connection.query(query,function(error,rows,fields){
							if (error)
							{
								console.log("ERROR: " + error.message);
							}
							else
							{
								if(rows.length!==0)
								{
									console.log("DATA : "+JSON.stringify(rows));
									//callback(error, rows);
									var mQuery = "UPDATE simplemember SET moviesno= moviesno +'" + parseInt(movieCount) + "' WHERE smemberid='" + memid + "'";
									connection.query(mQuery);

									var bQuery  = "UPDATE simplemember SET balancedue= balancedue +'" + parseFloat(balanceDue) + "' WHERE smemberid='" + memid + "'";
									connection.query(bQuery);

									var pQuery = "INSERT INTO payment(memberid,amount,paydate) VALUES('" + memid + "','" + balanceDue + "','" + date + "')";
									connection.query(pQuery);

									var tQuery = "INSERT INTO transaction(memberid,date) VALUES('" + memid + "','" + date + "')";
									connection.query(tQuery);

									var tsQuery = "SELECT tranid FROM transaction WHERE memberid='" + memid + "' AND date='" + date + "'";


									connection.query(tsQuery,function(error,rows,fields){
										if (error)
										{
											console.log("ERROR: " + error.message);
										}
										else
										{
											if(rows.length!==0)
											{
												console.log("DATA : "+JSON.stringify(rows));
												transID = rows[0].tranid;

												var tdQuery = "INSERT INTO transactiondetails(tranid,movid,quantity,status) VALUES('" + parseInt(transID) + "','" + parseInt(movIds[i]) + "','" + parseInt(copies[i]) + "','rented')";
												console.log(tdQuery);
												connection.query(tdQuery);

												var aQuery = "INSERT INTO audit(memberid,tranid,movid,quantity,date,status,paidamount) VALUES('" + memid + "','" + transID + "','" + movIds[i] + "','" + copies[i] + "','" + date + "','rented','" + balanceDue + "')";
												connection.query(aQuery);
												callback(error,transID);
											}
										}
									});


								}
								else
								{
									console.log("returned 0 rows");
									callback(error);
								}
							}
						});
					}
				},movIds[i]);

			}
		}
	}
	catch (e)
	{
		console.log("Error in updating Simple table" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}



function getMovieCopiesNumer(callback,movId)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "SELECT noofcopies from movies WHERE movid='" + movId +  "'";

		console.log("MOVID:" + movId);
		connection.query(query,function(err,rows,pFields){
			if(err)
			{
				console.log("ERROR: " + err.message);
				//callback(err);
			}
			else
			{
				if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					console.log("TTTT:" + rows[0].noofcopies);
					callback(err,rows);
				}
				else
				{
					console.log("No Movies returned on the search criteria");
				}
			}
		});
	}
	catch (e)
	{
		console.log("Error in updating Simple table" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


function updatePremiumtable(callback,memid,movIds,copies,date)
{
	try
	{
		connection = server.poolObject.getConid;
		var movieCount = 0;
		var balanceDue;
		var transID;
		var existingcopies;

		for(var i=0;i<movIds.length;movIds++)
		{

			movieCount = parseInt(movieCount,10) + parseInt(copies[i],10);

			balanceDue = parseFloat(balanceDue) + parseFloat(copies[i]) * parseFloat(getRentAmount(movIds[i]));


			console.log("MOVIE NO FROM DATA:" + movIds);
			getMovieCopiesNumer(function(err,results){
				if(err)
				{

				}
				else
				{
					console.log("{}{}{}" + results[0].noofcopies);
					existingcopies = results[0].noofcopies;


					console.log("COPIES---:" + copies[i]);
					console.log("ECP" + existingcopies);
					var noofcopies = parseInt(existingcopies) - parseInt(copies[i]);
					console.log("NOC:" + noofcopies);

					var query = "UPDATE movies SET noofcopies='" + parseInt(noofcopies) + "' WHERE movid='" + parseInt(movIds[i]) +  "'";
					console.log("_________()()()" + query);
					connection.query(query,function(error,rows,fields){
						if (error)
						{
							console.log("ERROR: " + error.message);
						}
						else
						{
							if(rows.length!==0)
							{
								console.log("DATA : "+JSON.stringify(rows));
								//callback(error, rows);
								var mQuery = "UPDATE premiummember SET moviesno= moviesno +'" + parseInt(movieCount) + "' WHERE pmemberid='" + memid + "'";
								connection.query(mQuery);

								//var bQuery  = "UPDATE premiummember SET balancedue= balancedue +'" + parseFloat(balanceDue) + "' WHERE pmemberid='" + memid + "'";
								//connection.query(bQuery);

								var pQuery = "INSERT INTO payment(memberid,amount,paydate) VALUES('" + memid + "','" + balanceDue + "','" + date + "')";
								connection.query(pQuery);

								var tQuery = "INSERT INTO transaction(memberid,date) VALUES('" + memid + "','" + date + "')";
								connection.query(tQuery);

								var tsQuery = "SELECT tranid FROM transaction WHERE memberid='" + memid + "' AND date='" + date + "'";


								connection.query(tsQuery,function(error,rows,fields){
									if (error)
									{
										console.log("ERROR: " + error.message);
									}
									else
									{
										if(rows.length!==0)
										{
											console.log("DATA : "+JSON.stringify(rows));
											transID = rows[0].tranid;

											var tdQuery = "INSERT INTO transactiondetails(tranid,movid,quantity,status) VALUES('" + parseInt(transID) + "','" + parseInt(movIds[i]) + "','" + parseInt(copies[i]) + "','rented')";
											console.log(tdQuery);
											connection.query(tdQuery);

											var aQuery = "INSERT INTO audit(memberid,tranid,movid,quantity,date,status,paidamount) VALUES('" + memid + "','" + transID + "','" + movIds[i] + "','" + copies[i] + "','" + date + "','rented','" + balanceDue + "')";
											connection.query(aQuery);
											callback(error,transID);
										}
									}
								});
							}
							else
							{
								console.log("returned 0 rows");
								callback(error);
							}
						}
					});
				}
			},movIds[i]);

		}		
	}
	catch (e)
	{
		console.log("Error in updating Premium table" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}


	
function deleteMember(callback,firstname,lastname,memID,type){
	try
	{connection = server.poolObject.getConnection();
	var query = "Select * from person  where firstname= '" + firstname +  "' and lastname='"+ lastname +"' and memberid='"+ memID +"' and type='"+ type +"'";
	connection.query(query,function(err,rows,pFields){
		if(err)
		{
			console.log("ERROR: " + err.message);
			callback(err);
		}
		else
		{ 
			if(rows.length!==0)
			{
				console.log(firstname);
				console.log(lastname);
				console.log(memID);
				console.log(type);


				var aQuery = "delete from person where firstname= '" + firstname +  "' and lastname='"+ lastname +"' and memberid='"+ memID +"' and type='"+ type +"'";
				connection.query(aQuery,function(err,rows,pFields){
					if(err)
					{
						console.log("ERROR: " + err.message);
						callback(err);
					}
					else
					{
						if(rows.length!==0)
						{
							console.log("DATA : "+JSON.stringify(rows));
							callback(err, rows);
							console.log("Successfully deleted the member " + firstname);
						}
						else
						{
							console.log("Error in deleting the member " + firstname);
							callback(err, rows);
						}
					}
				});
			}
			else
			{
				console.log("Member with theName" + firstname + "does not exist!!!");
				err = "Member with theName" + firstname + "does not  exist!!!";
				callback(err, rows);
			}

		}
	});
	}catch (e)
	{
		console.log("Failed to delete the Member" + e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}
}

function updateProfile( callback,firstname,lastname,memtype,memid,address,city,state,zipcode,country)
{
	try
	{
		connection = server.poolObject.getConnection();
		var query = "UPDATE person SET firstname = IFNULL('" + firstname + "'" + ",firstname),lastname = IFNULL('" + lastname + "'" + ",lastname),address = IFNULL('" + address + "'" + ",address),city = IFNULL('" + city + "'" + ",city),state = IFNULL('" + state + "'" + ",state),zipcode = IFNULL('" + zipcode + "'" + ",zipcode),country = IFNULL('" + country + "'" + ",country) WHERE memberid='" + memid + "'";
		console.log(query);

		connection.query(query,function(error,rows,fields){
			if (error)
			{
				console.log("ERROR: " + error.message);
				callback("Failed to update profile");
			}
			else
			{
				callback(error,rows);
			}
		});
		
	}
	catch (e)
	{
		console.log("Error in updating person table" + e);
		callback(e);
	}
	finally
	{
		if(connection != null)
		{
			server.poolObject.returnConnection(connection);
		}
	}

}


exports.deleteMember=deleteMember;
exports.signIn = signIn;
exports.updateLoggedInfo = updateLoggedInfo;
exports.createMember = createMember;
exports.searchMovie = searchMovie;
exports.listAllMovies = listAllMovies;
exports.listAllPremium = listAllPremium;
exports.listAllSimple = listAllSimple;
exports.searchPerson = searchPerson;
exports.addMovies = addMovies;
exports.simpleMemMovieCount = simpleMemMovieCount;
exports.premiumMemMovieCount = premiumMemMovieCount;
exports.getMemShipDate = getMemShipDate;
exports.updateSimpletable = updateSimpleTable;
exports.getMovieCopiesNumer = getMovieCopiesNumer;
exports.getRentAmount = getRentAmount;
exports.updatePremiumtable = updatePremiumtable;
exports.updateProfile = updateProfile;