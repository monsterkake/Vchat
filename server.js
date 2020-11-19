const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
const fs = require('fs');

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
	//console.log("authorisationFunction");
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('Disconnect', Disconnect)
	socket.on('Authorisation_', Authorisation)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--;
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

http.listen(port, () => console.log(`Active on ${port} port`))

function Authorisation()
{
	console.log("authorisationFunction");
	fs.writeFile('data.txt', "text", (err) => { 
	      
	    if (err) return console.log(err);
		console.log("file created");

	}) 
}

/*
	fetch('data.txt')
	.then(function(response){
		return response.text();
	})
	.then(function(data){
		console.log(data)
		text = data
		
		if(text == "gayyyy")
			console.log("sex")
		else
			console.log(":(")
	})
	*/