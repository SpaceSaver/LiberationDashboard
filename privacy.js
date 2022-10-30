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
	return undefined;
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
// async function getRamSession() {
// 	const ram_cookie = getCookie("ram");
// 	const new_id = (await (await fetch("https://ramlink.eth0sdashboard.gq/?existing=" + encodeURIComponent((!ram_cookie || ram_cookie.toLowerCase().includes("error")) ? undefined : ram_cookie))).text());
// 	console.log(new_id);
// 	if (!new_id.toLowerCase().startsWith("http") || new_id.toLowerCase().includes("error")) {
// 		alert("An error has occured while fetching rammerhead id.");
// 		throw("Invalid id.");
// 	}
// 	let split_id = new_id.split("/");
// 	setCookie("ram", split_id[split_id.length - 2], 365250);
// 	return new_id;
// }
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
	document.getElementById("open_in_ram").href = "https://uv.eth0sdashboard.gq/service/" + encodeUV(window.location.href);
	const clear = document.querySelector("#clear");
	clear.addEventListener("click", () => {
		deleteCookie("ram");
		deleteCookie("favs");
		alert("Cookies deleted!");
	});
	const no_crypto = document.querySelector("#no_crypto");
	const yes_crypto = document.querySelector("#yes_crypto");
	no_crypto.addEventListener("click", () => {
		setCookie("no_crypto", "1", 365);
		alert("Opted out for 1 year. :(");
		window.location.reload();
	});
	yes_crypto.addEventListener("click", () => {
		deleteCookie("no_crypto");
		alert("Opted in! :)");
		window.location.reload();
	})
}
function encodeUV(url) {
	return encodeURIComponent(url.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}
window.onload = loadStuff;