console.log = function(message) {
  document.getElementById('console').innerHTML += message + "\n";
};

var ws = new WebSocket("ws:"+window.location.href.split(":")[1]+":8000")
  , config = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]}
  , pc = new webkitRTCPeerConnection(config)
  , constraints = {mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    }
  , connected = false
  , _id;

pc.onicecandidate = function( e ){
  if ( !e.candidate ) return;
  ws.send(JSON.stringify({
    type: 'received_candidate',
    data: {
      label: e.candidate.sdpMLineIndex,
      id: e.candidate.sdpMid,
      candidate: e.candidate.candidate
    }
  }));
};

pc.onaddstream = function( e ){
  var vid = document.createElement('video');
  vid.src = URL.createObjectURL(e.stream);
  document.body.appendCHild(vid);
  vid.play();
  console.log('start remote video stream');
};

function broadcast() {
  // gets local video stream and renders to vid1
  navigator.webkitGetUserMedia({audio: true, video: true}, function( s ){
    var vid = document.createElement('video');
    vid.src = URL.createObjectURL(s);
    document.body.appendChild(vid);
    vid.play();
    pc.addStream(s);
    connect();
  });
};

function connect(){
  pc.createOffer(function( description ){
    pc.setLocalDescription(description);
    ws.send(JSON.stringify({
      type: 'received_offer',
      data: description,
      id: _id
    }));
  }, null, constraints);
}

ws.onopen = function(){
  console.log('Socket Open');
};

ws.onmessage = function( msg ){
  evtHandler(JSON.parse(msg.data));
};

function evtHandler( data ){
  var candidate;
  console.log(data.type);
  switch( data.type ){
    case 'assigned_id':
      _id = data.id;
      break;
    case 'receiver_offer':
      pc.setRemoteDescription(new RTCSessionDescription(data));
      pc.createAnswer(function( description ){
        console.log('sending answer');
        pc.setLocalDescription(description);
        socket.send(JSON.stringify({
          type: 'received_answer',
          data: description,
          id: _id
        }));
      }, null, constraints);
      break;
    case 'received_answer':
      if ( connected ) return;
      pc.setRemoteDescription(new RTCSessionDescription(data));
      connected = true;
      break;
    case 'received_candidate':
      candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate
      });
      pc.addIceCandidate(candidate);
      break;
    default:
      'WTF';
      break;
  }
}

window.onload = broadcast;

window.onbeforeunload = function(){
  ws.send(JSON.stringify({type: 'close', data: {id: _id} }));
  pc = null;
};
