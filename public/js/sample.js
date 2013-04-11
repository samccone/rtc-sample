var dataChannelChat = {
  send: function(message) {
    for(var connection in rtc.dataChannels) {
      var channel = rtc.dataChannels[connection];
      channel.send(message);
    }
  },
  recv: function(channel, message) {
    return JSON.parse(message).data;
  },
  event: 'data stream data'
};

rtc.on(dataChannelChat.event, function() {
  var d = dataChannelChat.recv.apply(this, arguments);
  console.log((new Date).getTime());
  console.log(d.stamp);
  console.log((new Date).getTime() - d.stamp);
});

rtc.on('add remote stream', function(stream, socketId) {
  console.log("ADDING REMOTE STREAM...");
  rtc.attachStream(stream, socketId);
});

rtc.connect('ws://localhost:8001', '');

function ping() {
  dataChannelChat.send(JSON.stringify({
     "eventName": "chat_msg",
     "data": {
       "stamp": (new Date).getTime()
     }
   }));
}
