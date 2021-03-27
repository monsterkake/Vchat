const chatButton = document.getElementById("chatButton")

if(sessionStorage.getItem("userRole") != "admin")
	{
		sessionStorage.setItem("userRole","basic")
		
	}

let userRole = sessionStorage.getItem("userRole")

createLabel(userRole);

if(sessionStorage.getItem("operatorIsGone") == "true")
{
	alert("Оператор отсутствует");
	sessionStorage.setItem("operatorIsGone", "false");
}

if(userRole == "admin")
{
	createResetButton()
}

if(userRole == "basic")
{
	createOtherButton()
}

function createLabel(Role)
{
	let label = document.createElement('label');
    label.id = "label"
    label.innerHTML = "role:" + Role
    document.querySelector('#main').appendChild(label)
}

function createOtherButton()
{
	let button = document.createElement('button');
    button.id = "otherButton"
	button.setAttribute('class', "button")
    button.innerHTML = "Другое"
    document.querySelector('#main').appendChild(button)
	button.addEventListener('click',() =>{
		window.location.replace("addOptions/addOptions.html");
})
}

function createResetButton()
{
	let button = document.createElement('button');
    button.id = "resetButton"
	button.setAttribute('class', "button")
    button.innerHTML = "reset"
    document.querySelector('#main').appendChild(button)
	
	button.addEventListener('click',() =>{
})
}
