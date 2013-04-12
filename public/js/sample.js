var ctx = new webkitAudioContext()
  , pro = ctx.createScriptProcessor(512, 1, 1)
  , buffers = []
  , src

var dataChannelChat = {
  send: function(message) {
    for(var connection in rtc.dataChannels) {
      var channel = rtc.dataChannels[connection];
      channel.send(JSON.stringify(message));
    }
  },
  recv: function(channel, message) {
    return JSON.parse(message);
  },
  event: 'data stream data'
};

rtc.on(dataChannelChat.event, function() {
  var d = dataChannelChat.recv.apply(this, arguments);
  console.log(d)
  if ( !d.length ) return;
  buffers.push(new Float32Array(d));
});

rtc.on('add remote stream', function(stream, socketId) {
  console.log("ADDING REMOTE STREAM...");
  rtc.attachStream(stream, socketId);
});

rtc.connect('ws://localhost:8001', '');

navigator.webkitGetUserMedia({audio: true}, connect, streamErr);

function connect( stream ){
  src = ctx.createMediaStreamSource(stream);
  src.connect(pro);
  pro.connect(ctx.destination);
  pro.onaudioprocess = processor;
}

function streamErr(){
  alert('O noes! couldn\'t get ur inputz');
}

function processor(evt){
  var input = evt.inputBuffer.getChannelData(0)
    , output = evt.outputBuffer.getChannelData(0)
    , buffer;
  // send it
  dataChannelChat.send(Array.prototype.slice.call(input, 0));
  // play back buffers
  if ( buffers.length )
    output.set(buffers.shift());
  else
    output.set(new Float32Array(512))
}
