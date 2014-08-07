var reconnect = require('reconnect/shoe');
var shoe = require('shoe');
var dnode = require('dnode');
var hyperglue = require('hyperglue');
var fs = require('fs');
var gifHtml = fs.readFileSync(__dirname + '/gif-element.html', { encoding: 'utf8' });
var r = null;
var nextPage = null;
var fetching = false;
var waiting = [];

var addGif = function(name) {
        if(frames.top.scrollY > 30) {
            waiting.push(name);
            return;
        }

        var el = hyperglue(gifHtml, {
            'a': { href: 'images/' + name },
            'img': { src: 'images/thumbs/' + name }
        });

        var div = document.getElementById('gifs');
        div.insertBefore(el, div.firstChild);
}

reconnect(function(stream) {
    var d = dnode({
        addGif: function(gif) {
            console.log(document.getElementById('gifs').scrollTop);
            console.log('add gif', gif);
            addGif(gif)
        }
    });

    d.on('remote', function(remote) {
        r = remote;
        remote.getPage(null, function(err, result) {
            result.gifs.forEach(function(gif) {
                addGif(gif);
            })
            nextPage = result.next;
        })
    });
    d.pipe(stream).pipe(d);
}).connect('/giffer');

window.addEventListener('scroll', function(evt) {
    // if y < 30 display new gifs
    var y = evt.pageY;

    if(y === 0) {
        waiting.map(function(gif) {
            addGif(gif);
        });
        waiting = [];
    }

    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrolledToBottom = (scrollTop + window.innerHeight) >= document.body.scrollHeight;
    if(scrolledToBottom && fetching === false) {
        if(nextPage === null) return;

        fetching = true;
        r.getPage(nextPage, function(err, result) {
            nextPage = result.next;
            result.gifs.forEach(function(gif) {
                addGif(gif);
            })
            fetching = false;
        })
    }
});

$(document).ready(function() {
  $(".fancybox-thumb").fancybox({
    afterLoad: function() {
      this.title = 'Put source and stuff here' + this.title;
    },
    openEffect	: 'elastic',
    closeEffect	: 'elastic',
    prevEffect	: 'none',
    nextEffect	: 'none',
    closeBtn		: false,
    helpers	: {
      title	: {
        type: 'inside'
      },
      buttons: {},
      thumbs	: {
        width	: 150,
        height	: 150
      },
      padding : 0
    }
  });
});
