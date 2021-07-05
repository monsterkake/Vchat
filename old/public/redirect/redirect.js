
if(sessionStorage.getItem("redirect") == "index")
{
	window.location.replace("../index.html");
}

else if(sessionStorage.getItem("redirect") == "chat")
{
	window.location.replace("../chat/chat.html");
}

sessionStorage.setItem("redirect", "index");