function startSite() {
    document.getElementById('initial-view').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function showSection(sectionId) {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('sections').style.display = 'block';
    const sections = document.querySelectorAll('#sections > aside, #sections > main');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function goBack() {
    document.getElementById('sections').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function addRestaurant() {
    const url = document.getElementById('restaurant-url').value;
    if (url) {
        const restaurantList = document.getElementById('restaurants');
        const div = document.createElement('div');
        div.className = 'restaurant';
        div.innerHTML = `<p>${url}</p>`;
        restaurantList.appendChild(div);
        document.getElementById('restaurant-url').value = '';
    }
}

function filterRestaurant() {
    const filterUrl = document.getElementById('filter-url').value.toLowerCase();
    const restaurants = document.getElementsByClassName('restaurant');
    for (let restaurant of restaurants) {
        const url = restaurant.innerText.toLowerCase();
        if (url.includes(filterUrl)) {
            restaurant.style.display = 'block';
        } else {
            restaurant.style.display = 'none';
        }
    }
}
