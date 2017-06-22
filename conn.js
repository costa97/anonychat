'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = 8888;
const INDEX = path.join(__dirname, 'index.html');

var risp = "undefined";
var female = [];
var male = [];
var last_message = [];
require('crypto');
require('js-sha256');
require('hash.js');
var sha256 = require('js-sha256');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));

  ws.on('message', function(message) {
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
                            ws.send(hash + '!err!');        
                        }
                        else
                        {
                            hash = female[female.length-1];    
                            ws.send(hash+'!conn!');   
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
                            ws.send(hash + '!err!');        
                        }
                        else
                        {
                            hash = male[male.length-1];    
                            console.log('new id: ' + hash);
                            ws.send(hash+'!conn!');        
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
                        ws.send(''+last_message[ind].id+'!mess!'+message.split('!')[1]+'!'+last_message[ind].mess+'!');
                        last_message.pop(ind);    
                    }                    
                }
        }
		
	});

});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

