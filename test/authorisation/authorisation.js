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
		alert("Неправильный пароль!")
	}
})
let userRole = sessionStorage.getItem("userRole")
