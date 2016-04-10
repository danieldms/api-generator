#!/usr/bin/env node
const fs = require('fs');
var program = require('commander');
const pluralize = require('pluralize');
const dot = require('dot');

// Custom libs
var Util = require(__dirname +'/util.js')();

// CONSTS
const version = "v1/";

const root_path = "./api";
const index_path = root_path + "/index.js";

const templateDir = __dirname +'/templates/';

// Model & Controller path
const controllerDir = root_path + '/controllers';
const modelDir = root_path + '/models';

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
	_init();
}

if(program.resource){
	generateResources(program.resource);
}

// Functions
function _init(){
	// template index file
    var fn = fs.readFileSync(__dirname +'/templates/main.jst').toString();

	fs.writeFile(index_path, fn, (err) => {
	 	if (err) throw err;
	 	console.log('creating index.js...');
	});

	// template config file
	var fn = fs.readFileSync(__dirname +'/templates/config.jst').toString();

	fs.writeFile(root_path + "/config.json", fn, (err) => {
	 	if (err) throw err;
	 	console.log('creating config.json...');
	});
}

function generateFolders(){

	console.log("creating folders and configure files...");

	fs.mkdir(root_path, () => {
		fs.mkdir(modelDir, () => {});

		fs.mkdir(controllerDir, () => {});
	});
}

function generateResources(resource){
	var cName = Util.capitalizeLetter(resource);

	var mName = pluralize.plural( Util.capitalizeLetter( resource ) );

	createController({
		"name": resource,
		"controller": cName,
		"model": mName
	});

	createModel({
		"name": pluralize.plural(resource),
		"model": mName
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

	// generate route to controller
	generateRoute(arg.controller);
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

function generateRoute(arg){
	var _path = root_path + '/config.json';

	try {
		var config = fs.readFileSync(_path).toString();
		config = JSON.parse(config);

	} catch(e){
		console.error(e.message);

		// template config file
		var fn = fs.readFileSync(__dirname +'/templates/config.jst').toString();

		fs.writeFile(root_path + "/config.json", fn, (err) => {
		 	if (err) throw err;
		 	console.log('creating config.json...');

		 	generateRoute(arg);
		});

	} finally {
		if(typeof config === "object"){
			
			// verify controler exists in cofig routes
			var crtl = arg + "Controller";
			if(config.routes.indexOf(crtl)){
				config.routes.push(crtl);
				Util.modifyFile(_path, JSON.stringify(config, null, 4));
			}

		}

	}


}