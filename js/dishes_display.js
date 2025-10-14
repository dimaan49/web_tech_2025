document.addEventListener('DOMContentLoaded', function() {
    displayDishes();
    initializeFilters();
});

function displayDishes() {
    // Сортируем блюда по названию в алфавитном порядке
    const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Группируем блюда по категориям
    const dishesByCategory = {};
    sortedDishes.forEach(dish => {
        if (!dishesByCategory[dish.category]) {
            dishesByCategory[dish.category] = [];
        }
        dishesByCategory[dish.category].push(dish);
    });
    
    // Создаем карточки для каждой категории
    Object.keys(dishesByCategory).forEach(category => {
        const categoryContainer = document.querySelector(`[data-category-items="${category}"]`);
        if (categoryContainer) {
            // Очищаем контейнер
            categoryContainer.innerHTML = '';
            
            // Создаем карточки для каждого блюда
            dishesByCategory[category].forEach(dish => {
                const dishCard = createDishCard(dish);
                categoryContainer.appendChild(dishCard);
            });
        }
    });
    
    console.log('Dishes displayed successfully');
}

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

// Функционал фильтрации
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
    // Проверяем, активен ли уже этот фильтр
    const isActive = button.classList.contains('active');
    
    // Снимаем активность со всех фильтров этой категории
    document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (!isActive) {
        // Активируем фильтр
        button.classList.add('active');
        filterDishesByKind(category, kind);
    } else {
        // Показываем все блюда категории
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