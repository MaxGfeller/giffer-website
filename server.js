var http = require('http')
var shoe = require('shoe')
var Giffer = require('giffer')
var Adapter9Gag = require('giffer-adapter-9gag')
var levelup = require('levelup')
var st = require('st')
var through = require('through')

var db = levelup(__dirname + '/db', { valueEncoding: 'json' })

var server = http.createServer(st(__dirname + '/public'))

var port = process.env.PORT || 80
server.listen(port)

var streams = []

var sock = shoe(function(s) {
    streams.push(s)

//    db.createReadStream({
//        keys: false,
//        values: true
//    }).pipe(through(function(val) {
//        this.emit('data', val.filename)
//    })).pipe(s)
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
    streams.forEach(function(s) {
        s.write(filename)
    })
})
