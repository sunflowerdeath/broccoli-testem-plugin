var Testem  = require('testem')

var testem = new Testem()

process.on('message', function(msg) {
	if (msg.cmd === 'start') {
		testem.startDev(msg.options)
	} else if (msg.cmd === 'restart') {
		//testem.restart()
		testem.app.startTests(function() {
			// Hack to remove broccoli's output
			var view = testem.app.view
			view.get('screen').erase('screen')
			view.render()
		})
	}
})
