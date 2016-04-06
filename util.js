module.exports = function() {
	'use strict'
	var fs = require('fs');

	return  { 
		capitalizeLetter : function(arg) {
			if(arg != 'undefined'){
				return arg.charAt(0).toUpperCase() + arg.slice(1);
			}
		},

		createFile: function(path, string){
			// Create file in disk
			fs.writeFile(path, string, (err) => {
			 	if (err) throw err;
			 	console.log('~> created file ' + path + "...");
			});
		},

		modifyFile: function(path, string){
			// Create file in disk
			fs.writeFile(path, string, (err) => {
			 	if (err) throw err;
			 	console.log('~> Modified file ' + path + "...");
			});
		}




	}

};