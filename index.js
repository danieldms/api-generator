#!/usr/bin/env node
const fs = require('fs');
var program = require('commander');
var pluralize = require('pluralize')

var version = "v1/";
var root_path = "./api";
var index_path = root_path + "/index.js";

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
	fs.mkdir(root_path, () => {
		
		console.log("created folder \'api\'");

		fs.mkdir(root_path + "/models", () => {
			console.log("created folder \'api\/models\'");
		});

		fs.mkdir(root_path + "/controllers", () => {
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

	fs.writeFile(index_path, tpl, (err) => {
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

	var controller = resource + "Controller.js";

	var path =  '/controllers/'+ controller;
	var path_all = root_path + path;
	
	// Create file Controller
	createFile(path_all, tpl);
	addRoute(controller, "." + path);
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

	var path = root_path + '/models/'+ resource +'Schema.js';

	createFile(path, tpl);
}

function addRoute(controller, path){
	// Fs read index file && add new file into routes
	fs.readFile(index_path, "utf8", (err, data) => {
	 	if (err) throw err;
	 	
	 	if(data){
	 		var new_data = [];
	 		// By lines
    		var lines = data.split('\n');
    		for(var line = 0; line < lines.length; line++){
    			var inline = lines[line];

    			new_data.push(inline);

    			// Search && add controllers
    			var search = inline.indexOf("express.Router()");
	 			if( search >= 0){
	 				new_data.push("\n// Resource for " + controller);
	 				new_data.push("require('"+ path +"')(router);");
	 			}

			}

			// create new file
			createFile(index_path, new_data.join("\n"));
			console.log("~> add new routes in index file");

	 	}
	});
}



// Util
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createFile(file, string) {
	var s = "created";
	if(false){
		s = "re-created";
	}
	// Create Schema
	fs.writeFile(file, string, (err) => {
	 	if (err) throw err;
	 	console.log('~> created file ' + file);
	});
}