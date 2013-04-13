### a simple web rtc binary data sample

`$ npm install`


`$ node server.js`


## send a message
    ws.send(JSON.stringify({
    type: "close",
    data: {
      id: ws._id
    }
    }));
