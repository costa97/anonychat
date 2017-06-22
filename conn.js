require('crypto');
require('js-sha256');
require('hash.js');
var sha256 = require('js-sha256');
//WEBSOCKET TO JAVASCRIPT
var WebSocketServer = require('websocket').server;
var http = require('http');
var risp = "undefined";
var female = [];
var male = [];
var last_message = [];

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.end("Hello world\n")
}).listen(process.env.PORT)

//CREATE THE SOCKET SERVER
// WEBSOCKET SERVER
    wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log('connected...');
    // This is the most important callback for us, we'll handle
    // all messages from users here.

	connection.on('message', function(message) {
        if (message.type === 'utf8') {
                // process WebSocket message
                message = (message.utf8Data+"");
                console.log(message);
                if(message.split('!')[2]=='conn')
                {
                    if(message.split('!')[1]=='male')
                    {
                        var hash = sha256(message.split('!')[0]);
                        console.log(hash);
                        if(female.length==0)
                        {
                            male.push(hash);		
                            connection.send(hash + '!err!');        
                        }
                        else
                        {
                            hash = female[female.length-1];    
                            connection.send(hash+'!conn!');   
                            female.pop(female.length-1);
                        }            
                    }
                    if(message.split('!')[1]=='female')
                    {
                        var hash = sha256(message.split('!')[0]);
                        console.log(hash);
                        if(male.length==0)
                        {
                            female.push(hash);		
                            connection.send(hash + '!err!');        
                        }
                        else
                        {
                            hash = male[male.length-1];    
                            console.log('new id: ' + hash);
                            connection.send(hash+'!conn!');        
                        }            
                    }        
                }
                if(message.split('!')[2]=='mess')
                {
                    console.log('response: '+message);
                    last_message.push({id:message.split('!')[0], gender: message.split('!')[1], mess:message.split('!')[3]});
                    //connection.send(''+message.split('!')[0]+'!mess!'+message.split('!')[1]+'!'+message.split('!')[3])+'!';
                }
            
                if(message.split('!')[2]=='rec')
                {
                    var ind="null";
                    for(var x=0; x<last_message.length; x++)
                    {
                        if(last_message[x].id==message.split('!')[0] & last_message[x].gender != message.split('!')[1])
                        {
                            ind = x;
                        }
                    }
                    if(ind != "null")
                    {
                        connection.send(''+last_message[ind].id+'!mess!'+message.split('!')[1]+'!'+last_message[ind].mess+'!');
                        last_message.pop(ind);    
                    }                    
                }
        }
		
	});


});

