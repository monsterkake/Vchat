let socket = io()
let userRole = sessionStorage.getItem("userRole")
const chatButton = document.getElementById("chatButton")

if(sessionStorage.getItem("userRole") != "admin")
	{
		sessionStorage.setItem("userRole","basic")
	}

console.log(userRole);

createLabel(userRole);

if(userRole == "admin")
{
	createResetButton()
}

function createLabel(Role)
{
	let label = document.createElement('label');
    label.id = "label"
    label.innerHTML = "role:" + Role
    document.querySelector('#main').appendChild(label)
}

function createResetButton()
{
	let button = document.createElement('button');
    button.id = "resetButton"
	button.setAttribute('class', "button")
    button.innerHTML = "reset"
    document.querySelector('#main').appendChild(button)
	
	button.addEventListener('click',() =>{
	socket.emit('reset')
	console.log('resetButton')
})
}
