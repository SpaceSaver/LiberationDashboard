let favorites;
function setCookie(cname, cvalue, exdays) {
	if (exdays != undefined) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
	}
	else {
		document.cookie = cname + "=" + cvalue + ";path=/";
	}
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return decodeURIComponent(c.substring(name.length, c.length));
		}
	}
	return "";
}
function deleteCookie(cname) {
	document.cookie = cname + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function getFavorites() {
	try {
		return JSON.parse(getCookie("favs"));
	} catch {
		return [];
	}
}
async function getRamSession() {
	const ram_cookie = getCookie("ram");
	const new_id = (await (await fetch("https://fetchrammerheadsession.spacesaver2000.repl.co/?existing=" + encodeURIComponent(ram_cookie))).text());
	console.log(new_id);
	setCookie("ram", new_id, 365250);
	return new_id;
}
function findInFavorites(site) {
	if ((typeof site) == "string") {
		site = {url: site};
	}
	for (let x = 0; x < favorites.length; x++) {
		if (favorites[x].url === site.url) {
			return x;
		}
	}
	return -1;
}
async function getRecomended() {
	return (await (await fetch("recommended_sites.json")).json());
}
function setFavorites(favs) {
	setCookie("favs", JSON.stringify(favs), 365250);
}
function loadStuff() {
	getRamSession().then(ram => {
		document.getElementById("open_in_ram").href = "https://rammerhead-heroku.spacesaver2000.repl.co/" + ram + "/" + window.location.href;
	}).catch(err => {
		console.log(err);
	});
	const frame = document.getElementById("frame");
	const button = document.getElementById("fs");
	// button.addEventListener("click", () => {
	// 	console.log("clock");
	// 	window.location.hash = "fs"
	// });
	window.onhashchange = () => {
		if (window.location.hash === "#fs") {
			frame.classList.add("fs");
		} else {
			frame.classList.remove("fs");
		}
	}
}
window.onload = loadStuff;
