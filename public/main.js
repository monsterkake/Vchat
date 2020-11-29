//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')
const filter = document.querySelector('#filter')
const checkboxTheme = document.querySelector('#theme')
const closeButton = document.querySelector('#closeButton')
const videoButton = document.querySelector('#videoButton')
const autoButton = document.querySelector('#autoButton')
let client = {}
let currentFilter = "none"



//get stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        socket.emit('NewClient')
        //used to initialize a peer
        function InitPeer(type) {
            let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
            peer.on('stream', function (stream) {
                CreateVideo(stream)
            })

            peer.on('data', function (data) {
                let decodedData = new TextDecoder('utf-8').decode(data)
                let peervideo = document.querySelector('#peerVideo')
                //peervideo.style.filter = decodedData
            })
			
			console.log("InitPeer ", type);
            return peer
        }

        //for peer of type init
        function MakePeer() {
            client.gotAnswer = false         
            let peer = InitPeer('init')
            peer.on('signal', function (data) {
				
                if (!client.gotAnswer) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer
        }

        //for peer of type not init
        function FrontAnswer(offer) {
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
            client.peer = peer
			console.log("FrontAnswer");
        }

        function SignalAnswer(answer) {
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
			console.log("SignalAnswer");
        }

        function CreateVideo(stream) {
            //CreateDiv()
			CreateMuteButton();
            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            video.setAttribute('class', 'embed-responsive-item')
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
			video.volume = 1
			
            //wait for 1 sec
            setTimeout(() =>{console.log("timeout")}, 1000)

            video.addEventListener('click', () => {
                if (video.volume != 0)
                    video.volume = 0
                else
                    video.volume = 1
            })
			console.log("CreateVideo");
        }

        function SessionActive() {
            document.write('Session Active. Please come back later')
        }
		
        function RemovePeer() {
			//document.getElementById("peerVideo").pause();
			if(document.getElementById("peerVideo") != null){
				document.getElementById("peerVideo").remove();
			}
				
            //document.getElementById("muteText").remove();
			//document.getElementById("muteButton").remove();
            if (client.peer) {
                client.peer.destroy()
				console.log("peer.destroy")
            }
			
        }
/*	
		 function Authorisation() {
			console.log("authorisationInBundle")
        }
*/
        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreatePeer', MakePeer)
        socket.on('Disconnect', RemovePeer)
    })
	.catch(err => console.log(err))
	
closeButton.addEventListener('click',() =>{
	console.log("closeButton.click")
	socket.emit('Disconnect')
	})
	
videoButton.addEventListener('click',() =>{
	console.log("videoButton.click")
	let video = document.getElementById("peerVideo")
	video.play()
})
	
	
window.onbeforeunload = () => 
{
	socket.emit('Disconnect')
}

checkboxTheme.addEventListener('click', () => {
    if (checkboxTheme.checked == true) {
        document.body.style.backgroundColor = '#212529'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#fff"
        }

    }
    else {
        document.body.style.backgroundColor = '#fff'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#212529"
        }
    }
})

function CreateMuteButton() {
	/*
    let button = document.createElement('button')
    button.setAttribute('class', "bottom")
    button.id = "muteButton"
    button.innerHTML = "Mute"
    document.querySelector('#menuDiv').appendChild(button)
	*/
}

function CreateDiv() {

    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
    if (checkboxTheme.checked == true)
        document.querySelector('#muteText').style.color = "#fff"
}