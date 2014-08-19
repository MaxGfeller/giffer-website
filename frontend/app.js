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

var html = fs.readFileSync(__dirname + '/gif-element.html', { encoding: 'utf8' });

var prependGifElement = function(el) {
    var div = document.getElementById('gifs');
    div.insertBefore(el, div.firstChild);
};

var appendGifElement = function(el) {
    var div = document.getElementById('gifs');
    div.appendChild(el);
};

var addGif = function(gif, prepend) {
  console.log('gif', gif);
    var el = hyperglue(html, {
        'a img': {
          src: 'images/thumbs/' + gif.filename,
          title: gif.metadata.origin,
          class: 'images'
        }
    });
    el.href = 'images/' + gif.filename;

    if (prepend) return prependGifElement(el);

    appendGifElement(el);
};

document.getElementById('displayNewGifs').addEventListener('click', function() {
    while (waiting.length > 0) {
        var gif = waiting.pop();
        addGif(gif, true);
        document.getElementById('numOfGifs').textContent = waiting.length;
    }
    document.getElementById('displayNewGifs').style.display = 'none';

});

reconnect(function(stream) {
    var d = dnode({
        addGif: function(gif) {
          console.log('gif', gif);
            waiting.push(gif);
            document.getElementById('numOfGifs').textContent = waiting.length;
            document.getElementById('displayNewGifs').style.display = 'block';
        }
    });

    d.on('remote', function(remote) {
        r = remote;
        remote.getPage(null, function(err, result) {
            result.gifs.forEach(function(gif) {
              addGif(gif, false);
            });
            nextPage = result.next;
        });
    });
    d.pipe(stream).pipe(d);
}).connect('/giffer');

window.addEventListener('scroll', function(evt) {
    // if y < 30 display new gifs
    var y = evt.pageY;

    if (y === 0) {
        waiting.map(function(gif) {
            addGif(gif);
        });
        waiting = [];
    }

    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrolledToBottom = (scrollTop + window.innerHeight) >= document.body.scrollHeight;
    if (scrolledToBottom && fetching === false) {
        if (nextPage === null) return;

        fetching = true;
        r.getPage(nextPage, function(err, result) {
            nextPage = result.next;
            result.gifs.forEach(function(gif) {
                addGif(gif);
            });
            fetching = false;
        });
    }
});

$(document).ready(function() {
  $('#gifs').magnificPopup({
    delegate: 'a', // child items selector, by clicking on it popup will open
    type: 'image',
    image: {
      titleSrc: function(item) {
        var link = item.el.querySelector('.images').attr('title');
        console.log('link', link);
        return '<a href="'+link+'">Source</a>';
      }
    },
    gallery: {
      enabled: true, // set to true to enable gallery

      preload: [0, 2], // read about this option in next Lazy-loading section

      navigateByImgClick: true,

      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

      tPrev: 'Previous (Left arrow key)', // title for left button
      tNext: 'Next (Right arrow key)', // title for right button
      tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
    }
  });
});
