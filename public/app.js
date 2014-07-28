var shoe = require('shoe')

var stream = shoe('/giffer')

stream.on('data', function(filename) {
    var img = document.createElement('img')
    img.src = 'images/' + filename
    document.body.insertBefore(img, document.body.firstChild)
})
