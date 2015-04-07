var assert = require('assert')
var path = require('path')

var _ = require('underscore')
var broccoli = require('broccoli')
var sinon = require('sinon')

var BroccoliTestem = require('..')

describe('broccoli-testem-plugin', function() {
	this.timeout(8000)

	var DIR = path.join(__dirname, 'files')

	var spy = sinon.spy(function(a, b, done) { done() })
	var OPTIONS = {
		// jshint ignore:start
		src_files: ['ok.js'],
		launch_in_dev: ['PhantomJS'],
		launch_in_ci: ['PhantomJS'],
		framework: ['mocha'],
		after_tests: spy,
		ci: true
		// jshint ignore:end
	}
	var FAIL_OPTIONS = _.extend({}, OPTIONS, {
		src_files: ['fail.js'] // jshint ignore:line
	})

	var builder

	afterEach(function() {
		if (builder) builder.cleanup()
		spy.reset()
	})

	it('runs tests and exit in CI mode', function() {
		var tree = BroccoliTestem(DIR, OPTIONS)
		builder = new broccoli.Builder(tree)
		return builder.build().
			then(function() {
				assert.equal(spy.callCount, 1)
			})
	})

	it('fails build when test fails in CI mode', function(done) {
		var tree = BroccoliTestem(DIR, FAIL_OPTIONS)
		builder = new broccoli.Builder(tree)
		builder.build()
			.then(function() {
				done(new Error('Build did not failed'))
			})
			.catch(function(error) {
				assert.equal(error.message, 'Testem exited with error')
				done()
			})
	})
})
