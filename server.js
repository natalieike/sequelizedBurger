//Dependencies
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");
var brouter = require("./controllers/burgers_controller.js");

//Set up Express
var app = express();
var PORT = process.env.PORT || 8080;

//Set up method-override, body-parser, and handlebars
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Send to controller
app.use(express.static(__dirname + '/public'))
app.use("/", brouter);

//Initialize server
app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});


