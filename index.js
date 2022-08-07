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
	const new_id = (await (await fetch("https://fetchrammerheadsession.spacesaver2000.repl.co/?existing=" + encodeURIComponent(ram_cookie.toLowerCase().includes("error") ? undefined : ram_cookie))).text());
	console.log(new_id);
	if (new_id.toLowerCase().includes("error")) {
		alert("An error has occured while fetching rammerhead id.");
		throw("Invalid id.");
	}
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
function injectTile(container, title, url, image, favorite_status, reverse) {
	const cont = document.createElement("div");
	const butt = document.createElement("button");
	const img = document.createElement("img");
	const box = document.createElement("div");
	const name = document.createElement("p");
	const fav_butt = document.createElement("button");
	const open_butt = document.createElement("button");
	const open_ram = document.createElement("button");
	cont.classList.add("option");
	butt.classList.add("collapsible");
	img.classList.add("icon");
	box.classList.add("colcontent");
	fav_butt.classList.add("opt");
	open_butt.classList.add("opt");
	open_ram.classList.add("opt");
	name.textContent = title;
	fav_butt.textContent = favorite_status ? "Unfavorite" : "Favorite";
	open_butt.textContent = "Open";
	open_ram.textContent = "Open with Rammerhead"
	img.src = image;
	open_butt.addEventListener("click", () => {
		window.location.href = url;
	});
	butt.addEventListener("click", function() {
		this.classList.toggle("active");
		let content = this.nextElementSibling;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
			content.style.maxWidth = 0;
		} else {
			content.style.maxWidth = "min-content";
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
	fav_butt.addEventListener("click", () => {
		if (favorite_status) {
			favorites.splice(findInFavorites(url), 1);
		} else {
			favorites.push({title: title, url: url, image: image});
		}
		setFavorites(favorites);
		window.location.reload();
	});
	open_butt.addEventListener("click", () => {
		window.location.href = url;
	});
	open_ram.addEventListener("click", async () => {
		open_ram.textContent = "Connecting..."
		const ram = await getRamSession();
		window.location.href = "https://rammerhead-spacesaver.herokuapp.com/" + ram + "/" + url;
	});
	box.appendChild(name);
	box.appendChild(fav_butt);
	box.appendChild(open_butt);
	box.appendChild(open_ram);
	butt.appendChild(img);
	cont.appendChild(butt);
	cont.appendChild(box);
	if (reverse) container.insertBefore(cont, container.firstChild);
	else container.appendChild(cont);
}
async function loadStuff() {
	favorites = getFavorites();
	const favorites_tray = document.getElementById("favorites");
	const recommended = await getRecomended();
	const recommended_tray = document.getElementById("recommend");
	for (let x = 0; x < favorites.length; x++) {
		injectTile(favorites_tray, favorites[x].title, favorites[x].url, favorites[x].image, true, true);
	}
	for (let x = 0; x < recommended.length; x++) {
		injectTile(recommended_tray, recommended[x].title, recommended[x].url, recommended[x].image, (findInFavorites(recommended[x]) > -1));
	}
	const add_custom = document.getElementById("add_custom");
	add_custom.addEventListener("click", () => {
		let url = prompt("What url would you like to add?");
		if (!url) return;
		const name = prompt("What would you like to call this?")
		if (!name) return;
		let clipped_url = (url.startsWith("https://") ? url.slice(8) : (url.startsWith("http://") ? url.slice(7) : url))
		clipped_url = clipped_url.split("/")[0];
		const image = "https://retail-silver-bison.faviconkit.com/" + clipped_url + "/64"
		if (!(url.startsWith("https://") || url.startsWith("http://"))) {
			url = "http://" + url;
		}
		favorites.push({title: name, url: url, image: image});
		setFavorites(favorites);
		location.reload();
	});
	document.getElementById("open_in_ram").href = "https://rammerhead-spacesaver.herokuapp.com/" + (await getRamSession()) + "/" + window.location.href;
}
window.onload = loadStuff;