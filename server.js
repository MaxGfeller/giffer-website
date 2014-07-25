var http = require('http')
var shoe = require('shoe')
var Giffer = require('giffer')
var Adapter9Gag = require('giffer-adapter-9gag')
var levelup = require('levelup')

var db = levelup(__dirname + '/db', { valueEncoding: 'json' })

var server = http.createServer(function(req, res) {

})

var port = process.env.PORT || 80
server.listen(port)

var sock = shoe(function(stream) {

})

sock.install(server, '/giffer')

// Instantiate giffer
var giffer = new Giffer({
    db: db,
    outputDir: __dirname + '/public/images',
    timeToRestart: 1000 * 60, // a minute pause
    adapters: [ new Adapter9Gag({ maxPages: 100 }) ]
})

giffer.start()
giffer.on('gif', function(filename) {
    console.log(filename)
})
