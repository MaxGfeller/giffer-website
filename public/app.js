var reconnect = require('reconnect/shoe');
var shoe = require('shoe');

reconnect(function(stream) {
    stream.on('data', function(filename) {
        var div = document.getElementById('gifs');
        document.body.appendChild(div);
        var divCentered = document.createElement('div');
        var a = document.createElement('a');
        a.className = 'fancybox-thumb';
        a.rel = 'fancybox-button';
        a.href = 'images/' + filename;
        var img = document.createElement('img');
        img.src = 'images/thumbs/' + filename;
        a.appendChild(img);
        divCentered.appendChild(a);
        div.appendChild(divCentered);
    });
}).connect('/giffer');

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

