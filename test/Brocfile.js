var path = require('path')

var broccoliTestem = require('..')

var testFiles = path.join(__dirname, 'files')

var testing = broccoliTestem(testFiles, {
	launch_in_dev: ['Chromium'],
	launch_in_ci: ['PhantomJS'],
	framework: ['mocha'],
	src_files: [
		'ok.js',
		'fail.js'
	]
})

module.exports = testing
