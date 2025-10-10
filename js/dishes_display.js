document.addEventListener('DOMContentLoaded', function() {
    displayDishes();
});

function displayDishes() {
    if (!dishes || !Array.isArray(dishes)) {
        console.error('Dishes array not found or is not an array');
        return;
    }
    
    const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));

    const dishesByCategory = {};
    sortedDishes.forEach(dish => {
        if (!dishesByCategory[dish.category]) {
            dishesByCategory[dish.category] = [];
        }
        dishesByCategory[dish.category].push(dish);
    });
    

    const container = document.querySelector('.menu-container');
    container.innerHTML = '';
    

    Object.keys(dishesByCategory).forEach(category => {
        const section = createCategorySection(category, dishesByCategory[category]);
        container.appendChild(section);
    });
    
    console.log('Dishes displayed successfully');
}

function createCategorySection(category, categoryDishes) {
    const section = document.createElement('section');
    section.className = 'menu-flexes';
    

    const heading = document.createElement('h3');
    heading.textContent = getCategoryName(category);
    section.appendChild(heading);
    

    const menuImages = document.createElement('div');
    menuImages.className = 'menu-images';
    

    categoryDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        menuImages.appendChild(dishCard);
    });
    
    section.appendChild(menuImages);
    return section;
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-dish', dish.keyword);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
        <p>${dish.price} р.</p>
        <p class="card-name">${dish.name}</p>
        <p>
            <a class="button-add">Добавить</a>
        </p>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'soup': 'Супы',
        'main': 'Вторые блюда',
        'drink': 'Напитки'
    };
    return categoryNames[category] || category;
}