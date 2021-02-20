var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
//creates a new socket.io instance attached to the http server.
var io = require('socket.io')(http);

// Imports the Google Cloud client library
const {PubSub} = require(`@google-cloud/pubsub`);

// Your Google Cloud Platform project ID
const projectId = 'Majestic-lodge-304920';

//Provide the absolute path to the dist directory.
app.use(express.static(__dirname + '/dist'));

//On get request send 'index.html' page as a response.
app.get('/', function(req, res) {
   res.sendFile(__dirname +'/index.html');
});

//Whenever someone connects this gets executed
//original : connection
io.on('connection', function (socket) {
  console.log(`Enter io connection`);
  console.log(' %s sockets connected', io.engine.clientsCount)

  const subscriptionName = 'PULL_SUBS';
  const topicName = 'TRANSACTION_TOPIC';
  const timeout = 50;
  // Instantiates a client
  const pubSubClient = new PubSub();

  var strData;
    /**
     * TODO(developer): Uncomment the following lines to run the sample.
     * https://cloud.google.com/pubsub/docs/pull#pubsub-pull-messages-async-nodejs
     */


    console.log(`Getting subsription`);

    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionName);
    console.log(`Got subsription`);



    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
  //  var obj = JSON.parse(message.data);
	//  console.log(`\tTimeStamp: ${obj.messages.timestamp}`);
	//  console.log(`\tAmount: ${obj.messages.amount}`);
	  
      
      messageCount += 1;
      console.log(`Message count : ${messageCount}`);
      
      message.ack();
      console.log(`Message Acknowledged`);

      // This doesn't ack the message, but allows more messages to be retrieved
      // if your limit was hit or if you don't want to ack the message.
      // message.nack();
    

      console.log(`Counts : ${messageCount}`);
      //strData = {"label": formatted,
        //             "value": Count
         //         }

      socket.emit('news', `${message.data}`);
      console.log(`emit:  ${message.data}`);
      };

    // Listen for new messages until timeout is hit
      subscription.on(`message`, messageHandler);
      
      setTimeout(() => {
      	console.log(`Enter timeout`);
      	//subscription.removeListener('message', messageHandler);
        console.log(`0 message(s) received.`);
        var x = new Date();

      	strData = {"label": "message.data"
              
                  }
        console.log(`strData : ${strData}`)
        console.log(``);
        socket.emit('news', 'timeout');
        
      }, timeout);

    //other handling
    if ( typeof strData == 'undefined') {
    	console.log(`Something else happened`)

        socket.emit('news', 'undefined');
              }

    console.log(`strData : undefined`);
    console.log(``);
    
    
    
});

//on Disconnect
io.on('disconnect', function () {
  console.log("LOG: just disconnected: " + socket.id);
  subscription.removeListener('message', messageHandler);
});

//server listening on port 8080
http.listen(8080, function() {
   console.log('listening on *:8080');
});