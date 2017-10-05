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

//Gets all burgers from the database
var getAllBurgers = function(res, cb){
	orm.burger.findAll({
		include: [orm.customer]
	}).then(function(data){
		var available = [];
		var eaten = [];
		for(var i = 0; i < data.length; i++){
			if(data[i].burger_devoured == 1){
				var dataObj = data[i].dataValues;
				dataObj.customerName = data[i].dataValues.customer.dataValues.customer_name;
				eaten.push(data[i].dataValues);
			}else{
				available.push(data[i].dataValues);
			}
		}
		var argObj = {
			burgerAvailable: available,
			burgerEaten: eaten
		};
		cb(res, argObj, function(result, obj){
			for(var i = 0; i < obj.burgerAvailable.length; i++){
				obj.burgerAvailable[i].customer = obj.customer;
			}
			result.render("index", obj);	
		});
	}).catch(function(err){
    console.log(err);
    res.status(400).end();
  });
};

//Gets all customers from the database
var getAllCustomers = function(res, argObj, cb){
	orm.customer.findAll().then(function(data){
		var customerArray = [];
		for(var i = 0; i < data.length; i++){
			customerArray.push(data[i].dataValues);
		}
		argObj.customer = customerArray;
		console.log(argObj);
		cb(res, argObj);
	})
};

//Route for CSS
brouter.get("/style", function(req, res){
	res.sendFile(path.join(__dirname, "../public/assets/css/style.css"));
});

//Get all of the Burgers, sort by Eaten or Available, and render index
brouter.get("/", function(req, res){
	getAllBurgers(res, getAllCustomers);
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

//Add a new customer, re-direct to re-render page
brouter.post("/customer", function(req, res){
	var customerName = req.body.customerName;
	orm.customer.create({
		customer_name: customerName
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
	var custId = req.body.cust_id;
	console.log(req.body);
	orm.burger.update({
		burger_devoured: true,
		customerId: custId
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