var fs = require('fs')
var path = require('path')
var childProcess = require('child_process')

var Testem  = require('testem')
var Q = require('q')
var rimraf = require('rimraf')
var quickTemp = require('quick-temp')
var symlinkOrCopySync = require('symlink-or-copy').sync

var Tree = function(inputTree, options) {
	if (!(this instanceof Tree)) return new Tree(inputTree, options)

	this.inputTree = inputTree
	quickTemp.makeOrRemake(this, 'testemDir')
	this.options = options
	this.options.cwd = this.testemDir
}

Tree.prototype.description = 'Testem'

var copyDirContent = function(srcDir, destDir) {
	var items = fs.readdirSync(srcDir)
	for (var i in items) {
		var item = items[i]
		var src = path.join(srcDir, item)
		var dest = path.join(destDir, item)
		symlinkOrCopySync(src, dest)
	}
}

Tree.prototype.read = function(readTree) {
	var _this = this
	return readTree(this.inputTree)
		.then(function(inputDir) {
			// Copy files to the testemDir
			rimraf.sync(_this.testemDir + '/*')
			copyDirContent(inputDir, _this.testemDir)
			return _this.runTestem(_this.options)
		})
		.then(function() { return _this.testemDir })
}

Tree.prototype.runTestem = function(options) {
	if (options.ci) {
		// Start server and wait until it exits.
		// When any test fails, build will fail too.
		var deferred = Q.defer()
		new Testem().startCI(options, function(exitCode) {
			if (exitCode !== 0) {
				deferred.reject(new Error('Testem exited with error'))
			} else {
				deferred.resolve()
			}
		})
		return deferred.promise
	} else {
		// Start server once and do not block - use with 'broccoli serve'
		if (!this.server) {
			// When server is started in current process, on Ctrl-C testem kills process
			// and broccoli can't cleanup. When process is forked, Ctrl-C stops only testem
			// and current process can exit correctly.
			this.server = childProcess.fork(path.join(__dirname, 'src/testemProcess.js'))
			this.server.send({
				cmd: 'start',
				options: options
			})
			this.server.on('exit', function() {
				process.emit('SIGINT')
			})
		} else {
			this.server.send({cmd: 'restart'})
		}
	}
}

Tree.prototype.cleanup = function() {
	if (this.server) this.server.kill()
	quickTemp.remove(this, 'testemDir')
}


module.exports = Tree
