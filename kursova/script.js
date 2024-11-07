let allGames = [];
async function loadGames() {
    try {
        const response = await fetch('data/games.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Неправильний тип контенту');
        }


        allGames = await response.json();
        displayGames(allGames);
        populateFilters(allGames);
    } catch (error) {
        console.error(error);
        alert('Сталася помилка при завантаженні даних.');
    }
}

function displayGames(games) {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = '';
    if (games.length === 0) {
        container.innerHTML = '<p>Нічого не знайдено.</p>';
        return;
    }


    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <h3>${game.title}</h3>
            <p>Розробник: ${game.developer}</p>
            <p>Жанр: ${game.genre}</p>
            <p>Рік: ${game.releaseYear}</p>
            <p>Платформи: ${game.platforms.join(', ')}</p>
            <p>Рейтинг: ${game.rating}</p>
            <button class="details-button">Деталі</button>
        `;
        card.querySelector('.details-button').addEventListener('click', () => openModal(game));
        container.appendChild(card);
    });

}

function openModal(game) {
    document.getElementById('modalTitle').innerText = game.title;
    document.getElementById('modalDescription').innerText = game.description;
    const videoId = game.videoId; 
    document.getElementById('modalVideo').src = `https://www.youtube.com/embed/${videoId}`;
    document.getElementById('modal').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalVideo').src = '';
    }

};

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalVideo').src = '';
    }
};

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

function populateFilters(games) {
    const genreFilter = document.getElementById('genreFilter');
    const platformFilter = document.getElementById('platformFilter');
    const genres = new Set();
    const platforms = new Set();
    games.forEach(game => {
        genres.add(game.genre);
        game.platforms.forEach(platform => platforms.add(platform));
    });

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.textContent = platform;
        platformFilter.appendChild(option);
    });

    genreFilter.addEventListener('change', filterGames);
    document.getElementById('developerFilter').addEventListener('input', filterGames);
    document.getElementById('yearFrom').addEventListener('input', filterGames);
    document.getElementById('yearTo').addEventListener('input', filterGames);
    platformFilter.addEventListener('change', filterGames);
    document.getElementById('ratingFilter').addEventListener('input', filterGames);
}

function filterGames() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const genre = document.getElementById('genreFilter').value;
    const developer = document.getElementById('developerFilter').value.toLowerCase();
    const yearFrom = parseInt(document.getElementById('yearFrom').value) || 0;
    const yearTo = parseInt(document.getElementById('yearTo').value) || 2023;
    const platform = document.getElementById('platformFilter').value;
    const rating = parseFloat(document.getElementById('ratingFilter').value) || 0;
    const filteredGames = allGames.filter(game => {
        return (
            game.title.toLowerCase().includes(search) &&
            (genre === '' || game.genre === genre) &&
            (developer === '' || game.developer.toLowerCase().includes(developer)) &&
            (game.releaseYear >= yearFrom && game.releaseYear <= yearTo) &&
            (platform === '' || game.platforms.includes(platform)) &&
            (game.rating >= rating)
        );
    });
    displayGames(filteredGames);
}

function sortGames(games, sortBy) {
    switch (sortBy) {
        case 'title':
            games.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            games.sort((a, b) => b.rating - a.rating);
            break;
        case 'year':
            games.sort((a, b) => a.releaseYear - b.releaseYear);
            break;
    }
    displayGames(games);
}

document.getElementById('sortByName').addEventListener('click', () => sortGames(allGames, 'title'));
document.getElementById('sortByRating').addEventListener('click', () => sortGames(allGames, 'rating'));
document.getElementById('sortByYear').addEventListener('click', () => sortGames(allGames, 'year'));

function searchGames(inputValue) {
    const filteredGames = allGames.filter(game => {
        const titleMatch = game.title.toLowerCase().includes(inputValue.toLowerCase());
        const developerMatch = game.developer.toLowerCase().includes(inputValue.toLowerCase());
        return titleMatch || developerMatch;
    });
   
    displayGames(filteredGames);
}

function showSuggestions(inputValue) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; // Очистити попередні пропозиції
    if (inputValue.length < 2) {
        return;
    }

    const filteredGames = allGames.filter(game => {
        const titleMatch = game.title.toLowerCase().includes(inputValue.toLowerCase());
        const developerMatch = game.developer.toLowerCase().includes(inputValue.toLowerCase());
        return titleMatch || developerMatch;
    });


    filteredGames.forEach(game => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = game.title;
        suggestionItem.addEventListener('click', () => {
            document.getElementById('searchInput').value = game.title;
            searchGames(game.title);
            document.getElementById('suggestions').innerHTML = ''; // Сховати пропозиції
        });
        suggestionsContainer.appendChild(suggestionItem);
    });

}

document.getElementById('searchInput').addEventListener('input', event => {
    const inputValue = event.target.value;
    showSuggestions(inputValue);
    searchGames(inputValue);
});

loadGames();