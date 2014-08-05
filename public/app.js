var reconnect = require('reconnect/shoe');
var shoe = require('shoe');
var dnode = require('dnode');

var addGif = function(name) {
        var div = document.getElementById('gifs');
        document.body.appendChild(div);
        var divCentered = document.createElement('div');
        var a = document.createElement('a');
        a.className = 'fancybox-thumb';
        a.rel = 'fancybox-button';
        a.href = 'images/' + name;
        var img = document.createElement('img');
        img.src = 'images/thumbs/' + name;
        a.appendChild(img);
        divCentered.appendChild(a);
        div.appendChild(divCentered);
}

reconnect(function(stream) {
    var d = dnode();

    d.on('remote', function(remote) {
        remote.getPage(null, function(err, result) {
            result.gifs.forEach(function(gif) {
                addGif(gif);
            })
        })
    });
    d.pipe(stream).pipe(d);
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
