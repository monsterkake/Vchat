const express = require('express')
const app = express()
const https = require('https')
const http = require('http')
const io = require('socket.io')(https)
const port = 3000
const fs = require('fs');

app.use(express.static(__dirname + "/public"))
let clients = 0

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};



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
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('Disconnect', Disconnect)
	socket.on('reset', resetServer)
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
	//console.log(this.broadcast)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

function resetServer()
{
	clients = 0
	console.log("reset")
}


//http.listen(port, () => console.log(`Active on ${port} port`))

http.createServer(app).listen(port , () => console.log(`Active on ${port} port`));

https.createServer(options, app ).listen(8000);
