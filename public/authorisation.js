let socket = io()
const authorisationButton = document.querySelector('#authorisationButton')
const passwordInput = document.querySelector('#passwordInput')
const OkButton = document.querySelector('#OkButton')

OkButton.addEventListener('click',()=>{
	if(passwordInput.value == "***"){
		console.log("correctpassword")
	}
	else{
		console.log("Incorrectpassword")
		socket.emit("correctPassword")
		socket.emit("Authorisation_")
	}
	
})
console.log(navigator.connection)