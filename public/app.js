var reconnect = require('reconnect/shoe');
var shoe = require('shoe');

reconnect(function(stream) {
    stream.on('data', function(filename) {
        var a = document.createElement('a');
        a.href = '#';
        var img = document.createElement('img');
        img.src = 'images/thumbs/' + filename;
        a.appendChild(img);
        document.body.insertBefore(a, document.body.firstChild);
    });
}).connect('/giffer');
