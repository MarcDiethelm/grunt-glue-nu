# grunt-glue-nu

> Create sprites automatically with Glue, but the Grunt.js way!

This [Grunt](http://gruntjs.com/) plugin wraps and enhances the [Glue](https://github.com/jorgebastida/glue) command line
spriting tool. It's built as a Grunt [multiTask](http://gruntjs.com/configuring-tasks#task-configuration-and-targets)
that supports extensible task and target-specific options, multiple source locations per target, globbing and so on.

Every task target results in one sprite 'bundle', consisting of the sprite sheet PNG image and a style sheet.
All of Glue's command line [options](http://glue.readthedocs.org/en/latest/options.html) are supported through the
options, adding some sensible defaults in order to minimize the need for configuration.

Glue supports .less style sheet output.

**☞** Jump to [Default usage](#default-usage)

grunt-glue-nu also allows you to send the argument to glue as a string, bypassing the plugin logic. Meaning you can
migrate to this plugin quickly and sort things out later. Or dodge bugs, should the need arise.


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-glue-nu --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-glue-nu');
```

## The "glue_nu" task

### Overview
In your project's Gruntfile, add a section named `glue_nu` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	glue_nu: {
		options: {
			// Task-specific options go here.
		},
		your_target: {
			// Target-specific file lists and/or options go here.
			options: {}
		}
	}
});
```

### Default usage

At the very minimum you must specify the task target's `src` and `dest` properties.
The file names of the sprite bundle and the sprite namespace will be the same as the task target. You can change any
aspect of that through the options of course.

```js
grunt.initConfig({
	glue_nu: {
		src: ['path/to/sprites/'],
		dest: 'output/folder/'
	}
});
```

### Options

**You can pass [any command line options supported by glue](http://glue.readthedocs.org/en/latest/options.html) as task
and/or target options.**

In addition grunt-glue-nu adds a few configuration options that are not passed on to glue. They are listed here:

- **options.bundleName** `{String} task:target` – The file names of the files created for the sprite bundle. By default they are the same as the task target name.

- **options.tmpDir** `{String} require('os').tmpdir()` – A temporary source folder for glue to operate in. By default it's your OS's temp directory.

- **options.glueArgs** `{Boolean} false` – Use `glueArgs` to set all arguments to the `glue` command manually as a string. All `options`, `src` and `dest` are
	then ignored for this target. 


#### Glue defaults

grunt-glue-nu sets some defaults for glue options that are deemed helpful.

```js
css: dest              // Write the sprite style sheet in your supplied dest
img: dest              // Write the sprite sheet in your supplied dest
recursive: true        // process sprites in sub-folders
crop: true             // crop sprites minimizing empty pixels
force: true            // forces glue to execute even if it detects no changes in the input
debug: true            // make glue return useful feedback
```

Glue by itself will exit with an error code if there are no images in the source folders. grunt-glue-nu catches that, prints a
warning and lets Grunt continue doing its job. 

### Longer usage example

```js
grunt.initConfig({
	glue_nu: {
		options: {
			css                : 'dist',
			less               : true,
			url                : '/static/img',
			namespace          : 's',
			'sprite-namespace' : '',
			retina:            : true
			optipng            : true
		},
		backgrounds: {
			options: {
				retina: false
			},
			src: ['path/to/sprites/*.{png,jpg,conf}'],
			dest: 'output/folder/'
		},
		icons: {
			options: {
				'sprite-namespace': 'icon'
			},
			src: ['path/to/sprites/*.png'],
			dest: 'output/folder/'
		},
		modules: {
			options: {
				bundleName: 'module'
				'sprite-namespace': ''
			},
			src: ['modules/carousel', 'modules/accordion'],
			dest: 'output/folder/'
		}
	}
});
```

## Troubleshooting

Run grunt with the `--debug` option to see information such as the `glue` command with the exact arguments used and which files and folder are being processed by Glue

## Contributing
[How to contribute to a project on Github](https://gist.github.com/MarcDiethelm/7303312)

## Release History
see [CHANGELOG.md](CHANGELOG.md)


