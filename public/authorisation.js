let socket = io()
const authorisationButton = document.querySelector('#authorisationButton')
const passwordInput = document.querySelector('#passwordInput')
const OkButton = document.querySelector('#OkButton')

OkButton.addEventListener('click',()=>{
	if(passwordInput.value == "***"){
		console.log("correctpassword")
		sessionStorage.setItem("userRole","admin")
	}
	else{
		console.log("Incorrectpassword")
		sessionStorage.setItem("userRole","basic")
	}
})
console.log(navigator.connection)
let userRole = sessionStorage.getItem("userRole")
console.log(userRole)