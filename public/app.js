var reconnect = require('reconnect/shoe')
var shoe = require('shoe')

reconnect(function(stream) {
    stream.on('data', function(filename) {
        var img = document.createElement('img')
        img.src = 'images/' + filename
        document.body.insertBefore(img, document.body.firstChild)
    })
}).connect('/giffer')
