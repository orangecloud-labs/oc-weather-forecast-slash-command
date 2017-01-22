var http = require('http');

http.createServer(function (req, res) {   
	res.writeHead(200, {'Content-Type': 'text/plain'});   
	res.end('Hello World\n'); 
}).listen(3000, '46.101.227.175'); 
console.log('Server running at http://46.101.227.175:3000/');
