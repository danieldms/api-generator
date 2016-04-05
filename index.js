#!/usr/bin/env node
const fs = require('fs');
var program = require('commander');
const pluralize = require('pluralize');
const dot = require('dot');

var Util = require(__dirname +'/util.js')();
console.log(Util);

// CONSTS
const version = "v1/";
const root_path = "./api";
const index_path = root_path + "/index.js";
const controllerDir = root_path + '/controllers';
const modelDir = root_path + '/models';
const templateDir = __dirname +'/templates/';

// Const template settings
var templateSettings = Object.keys(dot.templateSettings).reduce((o, k) => {
	o[k] = dot.templateSettings[k];
	return o;
}, {});

templateSettings.strip = false;
templateSettings.varname = 'data';

program
    .version('0.0.1')
    .usage('<keywords>')
    .option('-init, --init', 'Generate files to api')
    .option('-r, --resource <resource>', 'Generate api resource')
    .parse(process.argv);

if(program.init){
	generateFolders();
	createMain();
}

if(program.resource){
	generateResources(program.resource);
}

// Functions
function generateFolders(){
	fs.mkdir(root_path, () => {
		
		console.log("creating folder \'api\'");

		fs.mkdir(modelDir, () => {
			console.log("creating folder \'api\/models\'");
		});

		fs.mkdir(controllerDir, () => {
			console.log("creating folder \'api\/controllers\'");
		});
	});
}

function createMain(){
    var fn = fs.readFileSync(__dirname +'/templates/main.jst').toString();

	fs.writeFile(index_path, fn, (err) => {
	 	if (err) throw err;
	 	console.log('creating index.js...');
	});
}

function generateResources(resource){
	var cName = Util.capitalizeLetter(resource);

	var mName = pluralize.plural(resource);

	createController({
		"name": resource,
		"controller": cName
	});

	createModel({
		"name": pluralize.plural(resource),
		"model":Util.capitalizeLetter( mName)
	});
}


function createController(arg){

	var controllerName = arg.controller + "Controller.js";

	var path_all = root_path + '/controllers/'+ controllerName;

	var fn = dot.template(
      fs.readFileSync(templateDir + "controller.jst").toString(),
      templateSettings
    );

    var tpl = fn(arg);
	
	// Create file Controller
	Util.createFile(path_all, tpl);
}

function createModel(arg){
	var path = root_path + '/models/'+ arg.model +'Schema.js';

	var fn = dot.template(
      fs.readFileSync(templateDir + "model.jst").toString(),
      templateSettings
    );

    var tpl = fn(arg);

	Util.createFile(path, tpl);
}