// Generate random room name if needed
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

const roomHash = location.hash.substring(1);

let userRole = sessionStorage.getItem("userRole");

// TODO: Replace with your own channel ID
const drone = new ScaleDrone('i0QUyybS6IyjZK2X');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [
  {
	  urls: 'stun:stun.l.google.com:19302'
  }

	//urls: 'turn:numb.viagenie.ca',
	//credential: 'leto321678',
	//username: 'rolets@yandex.ru'
  ]
};
const pc_constraints = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
let room;
let pc;
  
function onSuccess() {
  
};

function onError(error) {
  console.error(error);
};

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      onError(error);
    }
  });
  // We're connected to the room and received an array of 'members'
  // connected to the room (including us). Signaling server is ready.
  room.on('members', members => {
    console.log('MEMBERS', members);
	//---------------------------------
	if( members.length < 2 )
	{
		if( userRole != "admin" )
		{
			window.location.replace("../index.html");
			sessionStorage.setItem("operatorIsGone", "true");
			//alert("Оператор отсутствует");
		}
	}
	
		
		
    // If we are the second user to connect to the room we will be creating the offer
    const isOfferer = members.length === 2;
    startWebRTC(isOfferer);
  });
});

// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}

function startWebRTC(isOfferer) {
	
	room = drone.subscribe(roomName);
	room.on('data', message => {
    console.log('Received message', message);
	if( ( message == "operatorIsGone" ) && ( userRole != "admin" ) )
	{
		window.location.replace("../index.html");
		//alert("Оператор отсутствует");
		sessionStorage.setItem("operatorIsGone", "true");
	}
    //$('.textArea').html(message); 
  });
  
pc = new RTCPeerConnection(configuration);

console.log('pc', pc);
  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    }
  }

  // When a remote stream arrives display it in the #remoteVideo element
  pc.ontrack = event => {
    const stream = event.streams[0];
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream;
    }
  };
 //pc.onaddstream = event => {
 //  remoteVideo.srcObject = event.stream;
 //};
 var video_constraints = {
  mandatory: {
    maxHeight: 640,
    maxWidth: 480 
  },
  optional: []
};
 
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: video_constraints,
  }).then(stream => {
    // Display your local video in #localVideo element
    //localVideo.srcObject = stream;
    // Add your stream to be sent to the conneting peer
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
  }, onError);

function onErrorForRTC(error) {
  room.on('data', (message, client) => {
    // Message was sent by us
    if (client.id === drone.clientId) {
      return;
    }

    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onErrorForRTC
      );
    }
  });
  console.log("onErrorForRTC");
};

  // Listen to signaling data from Scaledrone
room.on('data', (message, client) => {
    // Message was sent by us
    if (client.id === drone.clientId) {
      return;
    }

    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onErrorForRTC
      );
    }
  });
}
//document.writeln('<br><br><br><br>');
//document.writeln('https://robott.site/#'+roomHash);
function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}),
    onError
  );
}

const textArea_ = document.getElementById('text_');

function fun()
{
	console.log("+-+-+-+-+-+");
}

//room = drone.subscribe(roomName);
//room.on('data', message => {
//console.log('Received message', message);
//$('.textArea').value(message);
//});

window.onbeforeunload = function () {
    drone.publish({
		room: roomName,
		message: "operatorIsGone"
})
};

function sendInput()
{
var inp = document.getElementById('inp');
drone.publish({
room: roomName,
message: inp.value
})
}
