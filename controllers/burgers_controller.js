//Dependencies
var express = require("express");
var burger = require("../models/burger.js");
var brouter = express.Router();
var path = require("path");
var bodyParser = require("body-parser");

//Set up parsing
brouter.use(bodyParser.urlencoded({ extended: true }));
brouter.use(bodyParser.json());
brouter.use(bodyParser.text());
brouter.use(bodyParser.json({ type: "application/vnd.api+json" }));

//Route for CSS
brouter.get("/style", function(req, res){
	res.sendFile(path.join(__dirname, "../public/assets/css/style.css"));
});

//Get all of the Burgers, sort by Eaten or Available, and render index
brouter.get("/", function(req, res){
	burger.getAllBurgers(function(err, data){
		if(err){
			return console.log(err);
		}
		var available = [];
		var eaten = [];
		for(var i = 0; i < data.length; i++){
			if(data[i].burger_devoured == 1){
				eaten.push(data[i]);
			}else{
				available.push(data[i]);
			}
		}
		res.render("index", {burgerAvailable: available, burgerEaten: eaten});
	});
});

//Add a new burger, re-direct to get to re-render page
brouter.post("/", function(req, res){
	burger.addBurger(req.body.burgerName, function(err, data){
		if(err){
			return console.log(err);
		}
		res.redirect("/");
	});
});
//Update an existing burger, re-direct to get to re-render page
brouter.put("/", function(req, res){
	burger.updateBurger(req.body.id, req.body.burgerName, function(err, data){
		if(err){
			return console.log(err);
		}
		res.redirect("/");
	});
});

//Update a burger to Eaten, re-direct to get to re-render page
brouter.put("/:id", function(req, res){
	burger.eatBurger(req.body.id, function(err, data){
		if(err){
			return console.log(err);
		}
		res.redirect("/");
	});
});

//export Router
module.exports = brouter;