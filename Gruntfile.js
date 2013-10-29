/*
 * grunt-glue-nu
 * https://github.com/MarcDiethelm/grunt-glue-nu
 *
 * Copyright (c) 2013 Marc Diethelm
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js'
				,'tasks/*.js'
				//'<%= mochacli.all %>'
			]
			,options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['test/tmp']
		},

		// Configuration to be run (and then tested).
		glue_nu: {
			options: {
				namespace: 's'
			}

			,bundle_empty: {
				options: {
				},
				src: 'test/fixtures/empty/',
				dest: 'test/tmp'
			}
			,no_process_with_options: {
				options: {
					crop: true
				},
				src: [
					'test/fixtures/icon/'
				],
				dest: 'test/tmp'
			}
			,glueargs_no_process: {
				options: {
					glueArgs: '--crop test/fixtures/icon/ test/tmp' // forces _process: false
				}
			}
			,'default': {
				options: {
					//bundleName: 'bundle'
					//,'sprite-namespace': 'default'
				},
				src: [
					'test/fixtures/**/*.{png,jpg,conf}'
				],
				dest: 'test/tmp'
			}
			,'default_folders': {
				options: {
					bundleName: 'folders'
					,'sprite-namespace': 'folders'
				},
				src: [
					 'test/fixtures/icon'
					,'test/fixtures/retina/*.{png,jpg,conf}'
				],
				dest: 'test/tmp'
			}
		},

		// Unit tests.
		mochacli: {
			options: {
				//require: ['should'],
				reporter: 'spec',
				bail: true
			},
			all: ['test/*.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-cli');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'glue_nu'/*, 'mochacli'*/]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [/*'jshint'*/, 'test']);

};
