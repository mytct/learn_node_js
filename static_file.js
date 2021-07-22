var http = require('http'),
    fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
    if(!responseCode) responseCode = 200;
    //__dirname will resolve to the directory the executing script resides in
    //    So if your script resides in /home/sites/app.js, __dirname will resolve
    //    to /home/sites
    
    //readFile is an asynchronous method for reading files, There is a synchronous
    //  version of that function, fs.readFileSync, but the sooner you start thinking asyn‐
    //  chronously, the better
    fs.readFile(__dirname + path, function(err, data){
        if(err) {
            //if the file didn’t exist or there were permissions issues reading the file, the err
            // variable is set, and the function returns an HTTP status code of 500 indicating a server
            // error
            res.writeHead(500, { 'Content-Type' : 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type' : contentType });
            res.end(data);
        }
    });
}

http.createServer(function(req, res){
    // normalize url by removing querystring, optional
    // trailing slash, and making it lowercase
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(path) {
        case '':
            serveStaticFile(res, '/public/home.html', 'text/html');
            break;
        case '/about':
            serveStaticFile(res, '/public/about.html', 'text/html');
            break;
        case '/img/test.jpg':
            serveStaticFile(res, '/public/img/test.jpg', 'image/jpeg');
            break;
        default:
            serveStaticFile(res, '/public/notfound.html', 'text/html', 404);
            break;
    }
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');