// file with show all dishes and functionality of filters
window.dishes = [];

async function loadDishes() {
    const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
    
    try {
        console.log('Попытка загрузки данных с API...');
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiDishes = await response.json();
        console.log('Данные успешно загружены с API:', apiDishes);
        
        window.dishes = apiDishes.map(dish => {
            let category;
            switch(dish.category) {
                case 'main-course':
                    category = 'main';
                    break;
                case 'salad':
                    category = 'starter';
                    break;
                default:
                    category = dish.category; 
            }
            
            let image = dish.image;
            if (image && !image.startsWith('http')) {
                image = `https://edu.std-900.ist.mospolytech.ru${image}`;
            }
            
            return {
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price,
                category: category, 
                count: dish.count,
                image: image, 
                kind: dish.kind
            };
        });
        
        console.log('Данные преобразованы к нашему формату:', window.dishes);
        
    } catch (error) {
        console.warn('Ошибка загрузки с API, используем локальные данные:', error);
        
        if (!window.dishes || window.dishes.length === 0) {
            window.dishes = dishes;
        }
    }
}

// main
async function initializeApp() {
    await loadDishes(); 
    displayDishes();    
    initializeFilters(); 

    console.log('🔄 Вызываем восстановление корзины...');
    if (typeof window.restoreCartAfterAPILoad === 'function') {
        window.restoreCartAfterAPILoad();
    } else {
        console.log('⚠️ Функция restoreCartAfterAPILoad не найдена');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 DOM загружен, инициализируем приложение...');
    initializeApp();
});

function displayDishes() {
    if (!window.dishes || window.dishes.length === 0) {
        console.error('Нет данных о блюдах для отображения');
        return;
    }
    
    // sort
    const sortedDishes = window.dishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // by category
    const dishesByCategory = {};
    sortedDishes.forEach(dish => {
        if (!dishesByCategory[dish.category]) {
            dishesByCategory[dish.category] = [];
        }
        dishesByCategory[dish.category].push(dish);
    });
    
    // create cards
    Object.keys(dishesByCategory).forEach(category => {
        const categoryContainer = document.querySelector(`[data-category-items="${category}"]`);
        if (categoryContainer) {
            categoryContainer.innerHTML = '';

            dishesByCategory[category].forEach(dish => {
                const dishCard = createDishCard(dish);
                categoryContainer.appendChild(dishCard);
            });
        }
    });
    
    console.log('Dishes displayed successfully');
}
// create card function
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-category', dish.category);
    card.setAttribute('data-kind', dish.kind);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='./images/placeholder.jpg'">
        <p>${dish.price} р.</p>
        <p class="card-name">${dish.name}</p>
        <p>
            <a class="button-add">Добавить</a>
        </p>
    `;
    
    return card;
}

// filters
function initializeFilters() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('filter-btn')) {
            const button = event.target;
            const category = button.getAttribute('data-category');
            const kind = button.getAttribute('data-kind');
            
            toggleFilter(button, category, kind);
        }
    });
}

function toggleFilter(button, category, kind) {
    const isActive = button.classList.contains('active');
    
    document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (!isActive) {
       
        button.classList.add('active');
        filterDishesByKind(category, kind);
    } else {
       
        showAllDishes(category);
    }
}


function filterDishesByKind(category, kind) {
    const categoryContainer = document.querySelector(`[data-category-items="${category}"]`);
    if (!categoryContainer) return;
    
    const allCards = categoryContainer.querySelectorAll('.product-card');
    
    allCards.forEach(card => {
        const cardKind = card.getAttribute('data-kind');
        if (cardKind === kind) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showAllDishes(category) {
    const categoryContainer = document.querySelector(`[data-category-items="${category}"]`);
    if (!categoryContainer) return;
    
    const allCards = categoryContainer.querySelectorAll('.product-card');
    allCards.forEach(card => {
        card.style.display = 'block';
    });
}