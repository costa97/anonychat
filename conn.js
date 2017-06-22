var http = require('http');

http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
}).listen(process.env.PORT)


