function openGame(url) {


	if (!url.includes(".")) {
		url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
	} else {
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			// if no http or https is detected, add https automatically
			url = "https://" + url;
		}
	}
	var iframe = document.getElementById("game-frame");
	iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
	iframe.style.display = "block";
	iframe.style.zIndex = "9999";
}

let searchID = document.getElementById("name");

searchID.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
	event.preventDefault();
	if (searchID.value === "") {
		return;
	}
	openGame(searchID.value);
  }
})