console.log = function(message) {
  document.getElementById('console').innerHTML += message + "\n";
}

var ws = new WebSocket("ws:"+window.location.href.split(":")[1]+":8000");

ws.onmessage = function(d) {
  d = JSON.parse(d.data);
  if (d.type === "assigned_id") {
    this._id = d.id;
    console.log("id received");
  } else {
    console.log(d);
  }
};

function closeSocket() {
  ws.send(JSON.stringify({
    type: "close",
    data: {
      id: ws._id
    }
  }));
}

window.onbeforeunload = closeSocket;
