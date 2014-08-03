var reconnect = require('reconnect/shoe');
var shoe = require('shoe');

reconnect(function(stream) {
    stream.on('data', function(filename) {
        var div = document.getElementById('gifs');
        document.body.appendChild(div);
        var a = document.createElement('a');
        a.className = 'fancybox-thumb';
        a.rel = 'fancybox-thumb';
        a.href = 'images/' + filename;
        var img = document.createElement('img');
        img.src = 'images/thumbs/' + filename;
        a.appendChild(img);
        div.appendChild(a);
    });
}).connect('/giffer');

$(document).ready(function() {
  $(".fancybox-thumb").fancybox({
    prevEffect	: 'none',
    nextEffect	: 'none',
    helpers	: {
      title	: {
        type: 'outside'
      },
      thumbs	: {
        width	: 200,
        height	: 200
      },
      padding : 0
    }
  });
});

