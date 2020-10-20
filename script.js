const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const favoritesBtn = document.getElementById('favorites');

//NASA API
const count = 10;
const apiKey = '63zWojcLRLYZqLcpk5cANCFMyKglzI8Zz0LCSgGb';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
	//showing right navigation items
	if (page === 'results') {
		resultsNav.classList.remove('hidden');
		favoritesNav.classList.add('hidden');
	} else {
		resultsNav.classList.add('hidden');
		favoritesNav.classList.remove('hidden');
	}

	window.scrollTo({
		top: 0,
		behavior: 'instant',
	});
	loader.classList.add('hidden');
}

//updating dom
function createDOMNodes(page) {
	const array = page === 'results' ? resultsArray : page;
	array.forEach((result) => {
		//card container
		const card = document.createElement('div');
		card.classList.add('card');
		//link
		const link = document.createElement('a');
		link.href = result.hdurl;
		link.title = 'View Full Image';
		link.target = '_blank';

		//image
		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA Picture of the Day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');

		//card body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		//card title
		const cardTitle = document.createElement('h5');
		cardTitle.classList.add('card-title');
		cardTitle.textContent = result.title;

		//add to fav button
		const saveText = document.createElement('p');
		saveText.classList.add('clickable');
		if (page === 'results') {
			saveText.textContent = 'Add To Favorite';
			saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
		} else {
			saveText.textContent = 'Remove Favorite';
			saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
		}

		//card text
		const cardText = document.createElement('p');
		cardText.textContent = result.explanation;
		//Footer Container
		const footer = document.createElement('small');
		footer.classList.add('text-muted');

		//date
		const date = document.createElement('strong');
		date.textContent = result.date;

		//copyright
		const copyright = document.createElement('span');
		if (result.copyright) {
			copyright.textContent = ` ${result.copyright}`;
		}

		//apending
		footer.append(date, copyright);

		cardBody.append(cardTitle, saveText, cardText, footer);

		link.appendChild(image);
		card.append(link, cardBody);

		imagesContainer.appendChild(card);
	});
}

function updateDom(page) {
	//Reset cards from the Dom
	imagesContainer.textContent = '';

	createDOMNodes(page);
	showContent(page);
}

//add result to favorites
function saveFavorites(url) {
	//lopp through  the results array and store the matched url obj
	resultsArray.forEach((item) => {
		if (item.url.includes(url) && !favorites[url]) {
			favorites[url] = item;

			//show confirmation message
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
			}, 2000);

			//store favorites obj in local storage
			localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
		}
	});
}

//remove favorite from local storage
function removeFavorite(url) {
	if (favorites[url]) {
		delete favorites[url];
		//store favorites obj in local storage
		localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
	}

	updateDom(Object.values(favorites));
}

//get images from NASA API
async function getNasaPictures() {
	//show loader
	loader.classList.remove('hidden');

	try {
		const response = await fetch(apiUrl);
		resultsArray = await response.json();
		updateDom('results');
	} catch (error) {
		//catch the error
	}
}

//event listeners
favoritesBtn.addEventListener('click', () => {
	if (localStorage.getItem('nasaFavorites')) {
		favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
	}
	updateDom(Object.values(favorites));
});

//onload
getNasaPictures();
