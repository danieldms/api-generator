#!/usr/bin/env node
const fs = require('fs');
var program = require('commander');
var pluralize = require('pluralize')

var version = "v1/";

program
    .version('0.0.1')
    .usage('<keywords>')
    .option('-init, --init', 'Generate files to api')
    .option('-r, --resource <resource>', 'Generate api resource')
    .parse(process.argv);

if(program.init){
	createFolders();
	createFiles();
}

if(program.resource){
	createResource(program.resource);
}

// Functions
function createFolders(){
	fs.mkdir("./api", () => {
		
		console.log("created folder \'api\'");

		fs.mkdir("./api/models", () => {
			console.log("created folder \'api\/models\'");
		});

		fs.mkdir("./api/controllers", () => {
			console.log("created folder \'api\/controllers\'");
		});
	});
}

function createFiles(){
	var tpl = "var express = require('express'); \n"+
			  "var router = express.Router(); \n" +
			  "module.exports = function(app) { \n" +
			  "  app.use('/api/v1', router); \n"+
			  "};";

	fs.writeFile('./api/index.js', tpl, (err) => {
	 	if (err) throw err;
	 	console.log('created file index.js');
	});
}

function createResource(resource){
	var singular = resource;
	var plural = pluralize.plural(resource);

	createController(singular, plural);
	createModel(singular, plural);
}


function createController(singular, plural){

	resource = capitalizeFirstLetter(plural);

	// Template Controller
	var tpl = 
	"module.exports = function(router) {\n"+
	"	router.get('/"+ singular +"', function(req, res, next) { \n"+
	"		res.json({type: true});\n"+
	"	}); \n\n"+

	"	router.get('/"+ singular +"/:id', function(req, res, next) {\n"+
	"		res.json({type: true});\n"+
	"	});\n\n"+

	"	router.post('/"+ singular +"', function(req, res, next) {\n"+
	"		res.json({type: true});\n"+
	"	});\n\n"+

	"	router.put('/"+ singular +"/:id', function(req, res, next) {\n"+
	"		res.json({type: true});\n"+
	"	});\n\n"+

	"	router.delete('/"+ singular +"/:id', function(req, res, next) {\n"+
	"		res.json({type: true});\n"+
	"	});\n\n"+
	"};\n\n";

	var path = './api/controllers/'+ resource +'Controller.js';

	// Create Controller
	fs.writeFile(path, tpl, (err) => {
	 	if (err) throw err;
	 	console.log('~> created file ' + path);
	});
}

function createModel(singular, plural){

	resource = capitalizeFirstLetter(plural);

	// Tpl Schema
	var tpl = 
	"var mongoose = require('mongoose');\n"+
	"var Schema = mongoose.Schema;\n"+

	"module.exports = mongoose.model('"+ plural +"', new Schema({\n"+
	"	create_at: { type: Date, default: Date.now }\n"+
	"	update_at: { type: Date, default: Date.now }\n"+
	"}));";

	var path = './api/models/'+ resource +'Schema.js';

	// Create Schema
	fs.writeFile(path, tpl, (err) => {
	 	if (err) throw err;
	 	console.log('~> created file ' + path);
	});
}

// Util
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}