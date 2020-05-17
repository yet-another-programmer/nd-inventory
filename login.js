var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

var j = 1000;


var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'patients',
	port : '3308'
});

// con.connect(function(err){
// 	if (err)
// 	throw err;
// 	console.log('connected!!');
	
// });

var app = express();
app.set("view engine","jade");
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.render('login.jade');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM administrator WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				if (username == "root")
				{
					response.render('admin.jade');
				}
				else if (username == "view")
				{
					response.render('viewall.jade');
				}
				else 
				{
					response.render('enter_patients.jade');
				}
				
				// response.sendFile(path.join(__dirname + '/admin.jade'));
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.post('/enter',function(req,res){
	var username = req.body.user;
	var password = req.body.psw;
	console.log(username);
	console.log(password);
	
	
	if(username && password )
	{
		
		con.query("INSERT INTO administrator(username,password)  VALUES ('"+req.body.user+"','"+req.body.psw+"')",function(err,resuts){
			if (err)
			throw err;
			res.send("Records Inserted!")
			res.end;

			
		});

	}
	else
	{
		res.send('Please enter Username and Password!!');
		res.end;
	}
});

app.post('/view',function(req,res){
	con.query("SELECT * FROM details",function(err,results,fields){
		if (err)
		throw err;
		const jsonData = JSON.parse(JSON.stringify(results));
		console.log("jsonData", jsonData);
		const csvWriter = createCsvWriter({
			path: "patient.csv",
			header: [
			  { id: "id", title: "id" },
			  { id: "number", title: "number" },
			  { id: "name", title: "name" },
			  { id: "age", title: "age" },
			  { id: "sex", title: "sex" },
			  { id: "hospital", title: "hospital" },
			  { id: "phone", title: "phone" },
			  { id: "course", title: "course" }


			]});
			csvWriter.writeRecords(jsonData).then(() =>
			console.log("Records converted successfully!!!"));
			res.send("Check your excel sheet!");
			res.end;

		

		  });
	
	
		// console.log(results);
		// res.send(results);

	});


app.post('/pati',function(req,res){
	var patname = req.body.patname;
	var age = req.body.age;
	var sex = req.body.sex;
	var hospital = req.body.hospital;
	var phone = req.body.ph;
	
	console.log(req.body.patname,req.body.age,req.body.sex,req.body.hospital,req.body.ph);
	console.log(j);
	 if(patname && age && sex && hospital && phone )
	{
		
		con.query("UPDATE details SET name = '"+req.body.patname+"',age = '"+req.body.age+"',sex = '"+req.body.sex+"',hospital = '"+req.body.hospital+"',phone = '"+req.body.ph+"' WHERE number = '"+j+"'",function(err,resuts,fields){
			if (err)
			throw err;
			console.log(resuts);
			j=j+1;
					
		});
		con.query("SELECT course,id FROM details WHERE name = (?)",[req.body.patname] ,function(err,resuts,fields){
			if (err)
			throw err;
			console.log(resuts);
			
			res.send(resuts);
			res.end;

			
		});

	}
	else
	{
		res.send('Please enter All Values');
		res.end;
	}
	
});



// app.post('/getc',function(req,res){
// 	var patname = req.body.patname;
// 	var age = req.body.age;
// 	var sex = req.body.sex;
// 	var hospital = req.body.hospital;
// 	var phone = req.body.ph;
	
// 	console.log(req.body.patname,req.body.age,req.body.sex,req.body.hospital,req.body.ph);
// 	console.log(j);
// 	 if(patname && age && sex && hospital && phone )
// 	{
		
		

// 	}
// 	else
// 	{
// 		res.send('Please enter All Values');
// 		res.end;
// 	}
	
// });





app.listen(3000);