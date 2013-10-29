/*
 * grunt-glue-nu
 * https://github.com/MarcDiethelm/grunt-glue-nu
 *
 * Copyright (c) 2013 Marc Diethelm
 * Licensed under the MIT license.
 */

'use strict';

var  log = console.log
	,dir = console.dir
	,os = require('os')
	,path = require('path')
	,wrench = require('wrench')
;

module.exports = function (grunt) {

	//'--css=<%=destSpritesCss%> --img=<%=destSpritesImg%> --less --url=<%=staticUriPrefix%><%=baseDirName%> --namespace=s --sprite-namespace= --recursive --crop --optipng --force --debug'
	var defaults = {
			 _process: true
			,glueArgs: null
			,tmpDir: path.join(os.tmpdir(), 'grunt-glue-nu')
			,bundleName: null // default value set to task target inside the task
	
			,css: null // default value set to dest inside the task
			,img: null // default value set to dest inside the task
			,recursive: true
			,crop: true
			,force: true
			,debug: true
		}

		,extendedOptions = [
			 '_process'
			,'glueArgs'
			,'tmpDir'
			,'bundleName'
		]
	;
	
	// Turned out as quite the spaghetti code once I finally had a good API/implementation.
	// Would be nice to write some tests do some OO refactoring.
	
	 // todo: look at/test conf files use

	grunt.registerMultiTask('glue_nu', 'Create sprites automatically with Glue, but the grunt way!', function() {

		var  options = {}
			,src
			,glueSrcDir
			,glueArgs
			,done = this.async()
			,targetTmpDir
		;
		
		if (!this.data.options.glueArgs) { // this is the normal case
			// If the user doesn't specify the minimum info, die horribly
			/*!this.files[0].orig.src &&
				grunt.fail.fatal('No src specified.');
			
			!this.files[0].orig.dest &&
				grunt.fail.fatal('No dest specified.');*/
			!this.data.src &&
				grunt.fail.fatal('No src specified.');
			
			!this.data.dest &&
				grunt.fail.fatal('No dest specified.');
			
		
			// setting grunt dest as default for css and img args, so they can be overridden with specific options.
			// Glue says: You must choose the output folder using either the output argument or both --img and --css.
			// So we're using --img and --css
			defaults.css = this.files[0].orig.dest || null;
			defaults.img = this.files[0].orig.dest || null ;
			defaults.bundleName = this.target; // used as tmp dir name. glue uses that as sprite name
			
			// Merge task-specific and/or target-specific options with defaults.
			options = this.options(defaults);
		}
		else {
			options._process = false; // option.glueArgs forces no src processing
			options.glueArgs = this.data.options.glueArgs;
		}
		
		// Test if src is a simply directory
		// if so we disable 'processing', i.e. copying of files
		if (!options.glueArgs) {
			
			if (typeof this.data.src == 'string') {
				src = this.data.src;
			} else if (this.data.src.length == 1) {
				src = this.data.src[0];
			}
			
			if( src && grunt.file.isDir(src) ) {
				options._process = false;
			}
		}

		if (options._process) { // work with complex src (multiple sources, globbing)
			targetTmpDir = path.join(options.tmpDir, options.bundleName);

			// copy all files to a tmp folder for glue to work in
			this.filesSrc.forEach(function(file, index, array) {
				var fileName = path.basename(file);
				
				// file
				if (!grunt.file.isDir(file)) {
					grunt.file.copy(file, path.join(targetTmpDir, fileName));
				}
				// folder
				else {
					// create targetTmpDir if needed
					if (!grunt.file.isDir(targetTmpDir)) {
						grunt.file.mkdir(targetTmpDir);
					}
					// copy the folder into it
					wrench.copyDirSyncRecursive(file, path.join(targetTmpDir, fileName), {
						forceDelete: true, // Whether to overwrite existing directory or not
						preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
						inflateSymlinks: true // Whether to follow symlinks or not when copying files
					});
				}
			});

			glueSrcDir = targetTmpDir;
		}
		else if (!options.glueArgs) { // use unprocessed src, just pass the location (must be a directory!) to glue
			glueSrcDir = this.data.src;
		}

		if (!options.glueArgs) {
			// build the args to glue from options
			glueArgs = createGlueArgs(glueSrcDir, options);
			grunt.log.debug('> glue', glueArgs.join(' '));
		}
		else {
			grunt.log.debug('> glue', options.glueArgs);
			glueArgs = options.glueArgs.split(' ');
		}


		runGlue(glueArgs, function(err, result) {

			if (err) {
				// Glue thinks it's terrible when the src is empty. We don't
				if (err.message.indexOf('No images found') != -1) {
					grunt.log.warn(err.message.replace(/^Error: /, 'Glue: '));
				}
				else {
					grunt.fail.warn(err.message);
				}
			}

			grunt.log.debug(result.stdout);

			// remove the tmpDir and any targetTmpDirs it contains, must force because it's outside of working dir
			targetTmpDir && grunt.file.delete(options.tmpDir, {force: true});

			done(); // tell grunt this task:target is complete
		});

	});


	/**
	 * Builds command line args to glue from options object
	 * @param {String} srcDir
	 * @param options
	 * @returns {Array}
	 */
	function createGlueArgs(srcDir, options) {
		var  arg
			,glueArgs = [srcDir]
		;

		for (arg in options) {
			// don't push non-glue options into glue args
			if (extendedOptions.indexOf(arg) != -1) {
				continue;
			}
			// don't push options that aren't set into glue args
			if (options[arg] === null) {
				continue;
			}

			if (typeof options[arg] == 'boolean')
				glueArgs.push('--'+ arg);
			else
				glueArgs.push('--'+ arg +'='+ options[arg]);
		}

		return glueArgs;
	}

	/**
	 * Start a glue process
	 * @param {Array} args
	 * @param {Function} cb
	 */
	function runGlue(args, cb) {
		var options = {
			 cmd: 'glue'
			,args: args
		};
		grunt.util.spawn(options, function(err, result, code) {
			cb(err, result)
		});
	}

};



