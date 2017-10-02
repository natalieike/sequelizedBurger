//Dependencies
var express = require("express");
var orm = require("../models");
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
	orm.burger.findAll({
		attributes: ["id", "burger_name", "burger_devoured", "burger_date"]
	}).then(function(data){
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
	}).catch(function(err){
    console.log(err);
    res.status(400).end();
  });
});

//Add a new burger, re-direct to get to re-render page
brouter.post("/", function(req, res){
	var burgerName = req.body.burgerName;
	orm.burger.create({
		burger_name: burgerName
	}).then(function(data){
		res.redirect("/");
	}).catch(function(err){
    console.log(err);
    res.status(400).end();
  });
});
//Update an existing burger, re-direct to get to re-render page
brouter.put("/", function(req, res){
	var id = req.body.id;
	var burgerName = req.body.burgerName
	orm.burger.update({
		burger_name: burgerName
	},{
		where: {
			id: id
		}
	}).then(function(data){
		res.redirect("/");
	}).catch(function(err){
    console.log(err);
    res.status(400).end();
  });
});

//Update a burger to Eaten, re-direct to get to re-render page
brouter.put("/:id", function(req, res){
	var id = req.body.id;
	orm.burger.update({
		burger_devoured: true
	}, {
		where: {
			id: id
		}
	}).then(function(data){
		res.redirect("/");
	}).catch(function(err){
    console.log(err);
    res.status(400).end();
  });
});

//export Router
module.exports = brouter;