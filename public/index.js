
window.addEventListener('load', (event) => {
	if(sessionStorage.getItem("userRole") != "admin")
		{
			sessionStorage.setItem("userRole","basic")
		}
});

let userRole = sessionStorage.getItem("userRole")

console.log(userRole);

createLabel(userRole);

function createLabel(Role)
{
	let label = document.createElement('label');
    label.id = "label"
    label.innerHTML = Role
    document.querySelector('#main').appendChild(label)
}
		