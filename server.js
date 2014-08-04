var http = require('http');
var shoe = require('shoe');
var Giffer = require('giffer');
var Adapter9Gag = require('giffer-adapter-9gag');
var AdapterTwitter = require('giffer-adapter-twitter');
var AdapterReddit = require('giffer-adapter-reddit');
var levelup = require('levelup');
var st = require('st');
var through = require('through');

var db = levelup(__dirname + '/db', { valueEncoding: 'json' });

var server = http.createServer(st({
    path: __dirname + '/public',
    index: 'index.html'
}));

var port = process.env.PORT || 80;

// temp fix
process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

server.listen(port);

var streams = [];

var sock = shoe(function(s) {
    streams.push(s);
//    db.createReadStream({
//        keys: false,
//        values: true
//    }).pipe(through(function(val) {
//        this.emit('data', val.filename)
//    })).pipe(s)
});

sock.install(server, '/giffer');

// Instantiate giffer
var giffer = new Giffer({
    db: db,
    outputDir: __dirname + '/public/images',
    thumbDir: 'thumbs',
    thumbnailWidth: '200',
    thumbnailHeight: '200',
    timeToRestart: 1000 * 60, // a minute pause
    adapters: [
      new Adapter9Gag({ maxPages: 100 }),
      new AdapterTwitter({
        'path': 'statuses/filter',
        'query': {follow: [256099675, 1019188722, 223019569]}
      }),
      new AdapterReddit({
        'subreddit': 'funny',
        'sorting': 'hot',
        'limit': 100,
        'max_attempts': 5,
        'poll_interval': 5000,
        'items_to_get': 2000,
        'image_types': 'gif'
      }),
      new AdapterReddit({
        'subreddit': 'funnygifs',
        'sorting': 'hot',
        'limit': 100,
        'max_attempts': 5,
        'poll_interval': 5000,
        'items_to_get': 2000,
        'image_types': 'gif'
      }),
      new AdapterReddit({
        'subreddit': 'wtf_gifs',
        'sorting': 'hot',
        'limit': 100,
        'max_attempts': 5,
        'poll_interval': 5000,
        'items_to_get': 2000,
        'image_types': 'gif'
      }),
    ]
});

giffer.start();
giffer.on('gif', function(filename) {
    streams.forEach(function(s) {
        s.write(filename);
    });
});
