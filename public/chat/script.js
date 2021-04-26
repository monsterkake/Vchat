
function sendTelegramMessage(message)
{
	var token = "1705632980:AAEaLVh5pRgAbzaxYngdK62lnR0RUmTIpF8";
	var groupId = -488213839;
	var text1 = message;
	//var url = 'https://api.telegram.org/bot1705632980:AAEaLVh5pRgAbzaxYngdK62lnR0RUmTIpF8/sendMessage?chat_id=-488213839&text=hello'
	var url = 'https://api.telegram.org/bot'+ token +'/sendMessage?chat_id='+ groupId +'&text=' + text1;
	api = new XMLHttpRequest();
	api.open("GET", url, true);
	api.send();
}

// Generate random room name if needed
if (!location.hash) {
	//location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
	location.hash = "123"
}

const roomHash = location.hash.substring(1);

let userRole = sessionStorage.getItem("userRole");

function createHangUpButton() {
	let button = document.createElement('button')
	button.id = "hangUpButton"
	button.setAttribute('class', "button")
	button.innerHTML = "✆"
	document.querySelector('#videoBottom').appendChild(button)
	button.addEventListener('click', () => {
		drone.publish({
			room: roomName,
			message: "hangUp"
		})
		window.location.replace("../index.html");
	})
}

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
const pc_constraints = { "optional": [{ "DtlsSrtpKeyAgreement": true }] };
let room;
let pc;

function onSuccess() {

};

function onError(error) {
	console.log(error);
};

drone.on('open', error => {
	if (error) {
		return console.log(error);
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
		if (members.length > 2) {
			window.location.replace("../index.html");
			sessionStorage.setItem("message", "2");
		}
		if (userRole == "admin") {
			createHangUpButton();
		}
		sendTelegramMessage("chatIsReady!");
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
		if ((message == "operatorIsGone") && (userRole != "admin")) {
			window.location.replace("../index.html");
			sessionStorage.setItem("message", "1");
		}
		if ((message == "SDPError")) {
			sessionStorage.setItem("redirect", "chat");
			window.location.replace("../redirect/redirect.html");
		}
		if ((message == "hangUp")) {
			sessionStorage.setItem("message", "3");
			window.location.replace("../redirect/redirect.html");
		}
		//$('.textArea').html(message); 
	});

	pc = new RTCPeerConnection(configuration);

	console.log('pc', pc);
	// 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
	// message to the other peer through the signaling server
	pc.onicecandidate = event => {
		if (event.candidate) {
			sendMessage({ 'candidate': event.candidate });
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
					new RTCIceCandidate(message.candidate), onSuccess, onError
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

		function onErrorForSDP(error) {
			
			console.log(error);
			console.error(error);
			/*
			if (message.sdp) {
				// This is called after receiving an offer or answer from another peer
				pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
					// When receiving an offer lets answer it
					if (pc.remoteDescription.type === 'offer') {
						pc.createAnswer().then(localDescCreated).catch(onErrorForSDP);
					}
				}, onErrorForSDP);
			}
			else if (message.candidate) {
				// Add the new ICE candidate to our connections remote description
				pc.addIceCandidate(
					new RTCIceCandidate(message.candidate), onSuccess, onErrorForSDP
				);
			}
			*/
			//sessionStorage.setItem("redirect", "chat");
			//window.location.replace("../redirect/redirect.html");
			drone.publish({
				room: roomName,
				message: "SDPError"
			})
		}

		if (message.sdp) {
			// This is called after receiving an offer or answer from another peer
			pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
				// When receiving an offer lets answer it
				if (pc.remoteDescription.type === 'offer') {
					pc.createAnswer().then(localDescCreated).catch(onErrorForSDP);
				}
			}, onErrorForSDP);
		} else if (message.candidate) {
			// Add the new ICE candidate to our connections remote description
			pc.addIceCandidate(
				new RTCIceCandidate(message.candidate), onSuccess, onErrorForSDP
			);
		}
	});
}

function localDescCreated(desc) {
	pc.setLocalDescription(
		desc,
		() => sendMessage({ 'sdp': pc.localDescription }),
		onError
	);
}

const textArea_ = document.getElementById('text_');

window.onbeforeunload = function () {
	if(userRole == "admin")
	{
		drone.publish({
			room: roomName,
			message: "operatorIsGone"
		})
	}
};

function sendInput() {
	var inp = document.getElementById('inp');
	drone.publish({
		room: roomName,
		message: inp.value
	})
}
