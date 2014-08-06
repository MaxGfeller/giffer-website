var http = require('http');
var shoe = require('shoe');
var Giffer = require('giffer');
var Adapter9Gag = require('giffer-adapter-9gag');
// var AdapterTwitter = require('giffer-adapter-twitter');
var AdapterReddit = require('giffer-adapter-reddit');
var levelup = require('levelup');
var st = require('st');
var through = require('through');
var dnode = require('dnode');
var concat = require('concat-stream');

var db = levelup(__dirname + '/db', { valueEncoding: 'json' });

var server = http.createServer(st({
    path: __dirname + '/public',
    index: 'index.html',
    cache: false
}));

var port = process.env.PORT || 80;

// temp fix
process.on('uncaughtException', function(err) {
  console.error(err.stack);
  process.exit();
});

server.listen(port);

var streams = [];

// Instantiate giffer
var giffer = new Giffer({
    db: db,
    outputDir: __dirname + '/public/images',
    // thumbDir: 'thumbs',
    // thumbnailWidth: '200',
    // thumbnailHeight: '200',
    timeToRestart: 1000 * 60, // a minute pause
    adapters: [
      new Adapter9Gag({ maxPages: 20 }),
    //   new AdapterTwitter({
    //     'path': 'statuses/filter',
    //     'query': {follow: [256099675, 1019188722, 223019569]},
    //     'image_types': 'gif'
    //   }),
      new AdapterReddit({
        'subreddit': 'funnygifs',
        'sorting': 'hot',
        'limit': 100,
        'max_attempts': 5,
        'poll_interval': 5000,
        'items_to_get': 2000,
        'image_types': 'gif'
      })
    ]
});


var sock = shoe(function(s) {
    var d = dnode({
        getPage: function(start, cb) {
            if(!start || start === 0) start = Date.now();

            giffer.seqDb.createReadStream({
                lte: start,
                limit: 61,
                reverse: true
            }).pipe(through(function(val) {
                giffer.urlDb.get(val.value, function(err, value) {
                    if(err) throw err;

                    this.emit('data', {
                        key: val.key,
                        filename: value.filename
                    })
                }.bind(this))
            })).pipe(concat(function(gifs) {
                var obj = {
                    next: 999999999999999,
                    gifs: []
                }

                gifs.map(function(gif) {
                    if(parseInt(gif.key) < obj.next) obj.next = parseInt(gif.key);

                    obj.gifs.push(gif.filename)
                });

                cb(null, obj);
            }));
        }
    });
    d.pipe(s).pipe(d);
});

sock.install(server, '/giffer');

giffer.start();
giffer.on('gif', function(filename) {
    streams.forEach(function(s) {
        // s.write(filename);
    });
});
