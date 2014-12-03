var http = require('http');
var Giffer = require('giffer');
var levelup = require('levelup');
var st = require('st');
var fs = require('fs');
var through = require('through');
var concat = require('concat-stream');
var hyperstream = require('hyperstream');
var hyperglue = require('hyperglue');
var adapters = require('./adapters');
var url = require('url');
var oppressor = require('oppressor');

var gifHtml = fs.readFileSync(__dirname + '/frontend/gif-element.html', {
  encoding: 'utf8'
});

var db = levelup(__dirname + '/db', { valueEncoding: 'json' });
var mount = st({
    path: __dirname + '/public',
    index: 'index.html',
    cache: false
});

var giffer = new Giffer({
    db: db,
    outputDir: __dirname + '/public/images',
    timeToRestart: 1000 * 60,
    adapters: adapters
});

var server = http.createServer(function(req, res) {
  var u = url.parse(req.url, true)
  if(u.pathname == '/' || u.pathname == '/index.html') {
    var start = Date.now();
    createGifStream(start).pipe(res);
    return;
  }

  if(u.pathname == '/page') {
    var start = u.query.k || Date.now();
    createGifStream(start).pipe(res);
    return;
  }

  mount(req, res);
});

var port = process.env.PORT || 3456;

process.on('uncaughtException', function(err) {
  console.error(err.stack);
  process.exit();
});

server.listen(port);

var thumbnailerOptions = {
  outputDir: __dirname + '/public/images/thumbs',
  height: 200,
  resizeOpts: '>',
  base64: true
};

giffer.plugin(require('giffer-thumbnail'), thumbnailerOptions);
giffer.plugin(require('giffer-validator'));
giffer.plugin(require('giffer-md5-duplicates'));

giffer.start();
giffer.on('gif', function(filename, metadata) {
});

function createGifStream(start) {
  var tr = through(function(o) {
    // include base64 src for thumbnail
    var e = hyperglue(gifHtml, {
      '.item': {
        src: 'data:image/png;base64,' + o.metadata.base64
      },
      '.tile-inner': {
        href: 'images/' + o.filename
      },
      '.tile': {
        'data-key': o.key
      }
    })
    this.queue(e.innerHTML)
  })

  var hs = hyperstream({
    '#gifs': {
      _appendHtml: tr
    }
  });

  process.nextTick(function() {
    giffer.createSeqReadStream({
      lte: start,
      limit: 61,
      reverse: true
    }).pipe(tr);
  }.bind(this))

  return fs.createReadStream(__dirname + '/public/index.html').pipe(hs)
}
