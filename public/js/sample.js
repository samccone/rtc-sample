var ctx = new webkitAudioContext()
  , src

console.log = function(message) {
  document.getElementById('console').innerHTML += message + "\n";
}

rtc.on('add remote stream', function(stream, socketId) {
  console.log("ADDING REMOTE STREAM...");
  connect(stream);
});

rtc.on('connect', function() {
  console.log("** RTC connected");
});

rtc.createStream({audio: true}, function(){}, streamErr);

function connect( stream ){
  var audio = new Audio();
  audio.src = webkitURL.createObjectURL(stream);
  audio.play();
}

function streamErr(){
  alert('O noes! couldn\'t get ur inputz');
}

window.onload = function() {
  rtc.connect('ws://24.­250.­22.­134:­80001', '');
}