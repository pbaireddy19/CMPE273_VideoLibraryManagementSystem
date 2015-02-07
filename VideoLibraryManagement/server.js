
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, login = require('./routes/signin')
, movies = require('./routes/searchMovies')
, rentmovies = require('./routes/rentMovies')
, fullmovies = require('./routes/fullmoviesearch')
, premiumlist = require('./routes/listpremium')
, simplelist = require('./routes/listsimple')
, membersearch = require('./routes/searchmembers')
, addMovies = require('./routes/addMovies')
, addrentcart = require('./routes/addtocart')
, processcart = require('./routes/processcart')
, simplepayment = require('./routes/creditcard')
, signup = require('./routes/register')
, deleteMovie = require('./routes/deleteMovie')
, listmem = require('./routes/listallmem')
, deleteMember = require('./routes/deletemember')
, editprof = require('./routes/editprofile')
, prempay = require('./routes/premiumpay')
, auditlist = require('./routes/auditlist')
, path = require('path');


var poolObject = require('./routes/connectionpooling');
var dataObject = require('./routes/databasecontroller');
var app = express();
var sql = require('mysql');
var redis = require('redis');
var ejs = require('ejs');
var moment = require('moment');
var initStatus = true;


var client = redis.createClient();


//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'enterprisedistributedsystems'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//Redis Error Function
client.on("error", function (err) {
	console.log("Redis server cannot be reachead" + err);
});


app.get('/', routes.index);
app.post('/signin', login.login);
app.post('/addMovie',addMovies.add);
app.post('/deleteMovie',deleteMovie.deletemovie);
app.post('/deletemem',deleteMember.deleteMember);
app.get('/searchmovies',movies.search);
app.get('/searchmoviesrent',rentmovies.search);
app.get('/AllMovieController',fullmovies.fullsearch);
app.get('/listpremium',premiumlist.listpmem);
app.get('/listsimple',simplelist.listsmem);
app.get('/searchmembers',membersearch.searchmember);
app.post('/addtocart',addrentcart.addmovie);
app.post('/processcart',processcart.process);
app.post('/creditcard',simplepayment.pay);
app.post('/register',signup.register);
app.post('/editprofile',editprof.editprofile);
app.get('/paypremium',prempay.pay);
app.get('/auditlist',auditlist.list);
app.get('/listmem',listmem.listmem );


//Renders Signup Page from Index page
app.get('/signup', function(req, res){
	res.render('signup', { title: 'SignUp' });
});

app.get('/searchmovie',function(req,res){
	ejs.renderFile('./views/adminmoviesearch.ejs',{custDetails:req.session.custDetails, title: 'Search Movie',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/home', function(req, res){
	res.render('home', { title: 'Home',custDetails:req.session.custDetails,name:req.session.name });
});

app.get('/adminhome', function(req, res){
	res.render('admin', { title: 'adminHome',custDetails:req.session.custDetails,name:req.session.name });
});



app.get('/personalprofile', function(req, res){

	
	ejs.renderFile('./views/personalprofile.ejs',{custDetails:req.session.custDetails, title: 'Profile',name:req.session.name },function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/MovieSearch1', function(req, res){
	console.log(req.session.custDetails);
	ejs.renderFile('./views/moviesearch.ejs',{custDetails:req.session.custDetails, title: 'Search Movies',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});


app.get('/rentsearch', function(req, res){
	console.log(req.session.custDetails);
	ejs.renderFile('./views/rentsearch.ejs',{custDetails:req.session.custDetails, title: 'Rent Movies',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/searchmember', function(req,res){
	ejs.renderFile('./views/searchmember.ejs',{custDetails:req.session.custDetails, title: 'Search Member',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/deletemember', function(req,res){
	ejs.renderFile('./views/deletemembers.ejs',{custDetails:req.session.custDetails, title: 'Search Member',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/audit', function(req,res){
	ejs.renderFile('./views/audit.ejs',{custDetails:req.session.custDetails, title: 'Audit Movies'},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/addmovie', function(req,res){
	ejs.renderFile('./views/addmovie.ejs',{custDetails:req.session.custDetails, title: 'Add Movie',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/editprofile', function(req,res){
	ejs.renderFile('./views/editprofile.ejs',{custDetails:req.session.custDetails, title: 'Edit Profile',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});
app.get('/deletemovie', function(req,res){
	ejs.renderFile('./views/deletemovie.ejs',{custDetails:req.session.custDetails, title: 'Delete Movier',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/updatemovie', function(req,res){
	ejs.renderFile('./views/updatemovie.ejs',{custDetails:req.session.custDetails, title: 'Update Movie',name:req.session.name},function(err,results){
		if(!err)
		{
			res.end(results);
		}
	});
});

app.get('/signout',function(req,res){
	
	req.session.destroy(function(){
		ejs.renderFile('./views/index.ejs',{signoutmsg:"User Loggedout Successfully",title:"Login"},function(err,results){
			if(!err)
			{
				res.end(results);
			}
		});
	});
});

//Exporting variables to use in other modules
exports.poolObject = poolObject;
exports.ejs = ejs;
exports.sql = sql;
exports.redis = redis;
exports.client = client;
exports.dataObject = dataObject;
exports.moment = moment;

//creating pool of Database connections
poolObject.initializepool(10);

app.listen(app.get('port'), function(){
	console.log('Video Library Management server listening on port ' + app.get('port'));
});
