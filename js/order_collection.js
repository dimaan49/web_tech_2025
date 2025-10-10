let dishesCollection = [];
let isOrderModalOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeOrderFunctionality();
});

function initializeOrderFunctionality() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('button-add')) {
            const dishCard = event.target.closest('.product-card');
            const dishKeyword = dishCard.getAttribute('data-dish');
            addDishToOrder(dishKeyword);
        }
        
        // buttons dishes card
        if (event.target.classList.contains('decrease-btn')) {
            const dishCard = event.target.closest('.product-card');
            const dishKeyword = dishCard.getAttribute('data-dish');
            decreaseDishQuantity(dishKeyword);
        }
        
        if (event.target.classList.contains('increase-btn')) {
            const dishCard = event.target.closest('.product-card');
            const dishKeyword = dishCard.getAttribute('data-dish');
            increaseDishQuantity(dishKeyword);
        }
        
        // show order button
        if (event.target.classList.contains('button-view-order')) {
            event.preventDefault();
            toggleOrderModal();
        }
        
        // buttons in modal
        if (event.target.classList.contains('modal-decrease-btn')) {
            const dishItem = event.target.closest('.order-item');
            const dishKeyword = dishItem.getAttribute('data-dish');
            decreaseDishQuantity(dishKeyword);
            updateOrderModal();
        }
        
        if (event.target.classList.contains('modal-increase-btn')) {
            const dishItem = event.target.closest('.order-item');
            const dishKeyword = dishItem.getAttribute('data-dish');
            increaseDishQuantity(dishKeyword);
            updateOrderModal();
        }
        
        if (event.target.classList.contains('modal-remove-btn')) {
            const dishItem = event.target.closest('.order-item');
            const dishKeyword = dishItem.getAttribute('data-dish');
            removeDishFromOrder(dishKeyword);
            updateOrderModal();
        }
        
        // window close
        if (event.target.classList.contains('close-order-modal') || 
            event.target.classList.contains('order-modal-overlay')) {
            closeOrderModal();
        }
        
        // Обработчик для кнопки "Оформить заказ" в модальном окне
        if (event.target.classList.contains('submit-order-btn')) {
            event.preventDefault();
            submitOrder();
        }
        
        // Обработчик для кнопки "Продолжить покупки"
        if (event.target.classList.contains('continue-shopping-btn')) {
            event.preventDefault();
            closeOrderModal();
        }
        
        // Закрытие формы заказа
        if (event.target.classList.contains('close-button-order')) {
            closeOrderForm();
        }
        
        // Обработчик для кнопки "Заказать" в форме
        if (event.target.classList.contains('button-submit-order')) {
            event.preventDefault();
            const orderForm = document.querySelector('.order-submit-form');
            if (orderForm) {
                // Создаем событие отправки формы
                const submitEvent = new Event('submit', { cancelable: true });
                orderForm.dispatchEvent(submitEvent);
            }
        }
    });
    
    // Добавляем обработчик отправки формы
    const orderForm = document.querySelector('.order-submit-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }
}

// add dish to the order
function addDishToOrder(dishKeyword) {
    const dish = dishes.find(d => d.keyword === dishKeyword);
    if (!dish) return;
    
   // if exist
    const existingDish = dishesCollection.find(item => item.keyword === dishKeyword);
    
    if (existingDish) {
        existingDish.quantity += 1;
    } else {
        dishesCollection.push({
            ...dish,
            quantity: 1
        });
    }
    
   // card update
    updateDishCardDisplay(dishKeyword);
    
    console.log('Текущий заказ:', dishesCollection);
}

// dish q decrease
function decreaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    
    if (dishIndex !== -1) {
        if (dishesCollection[dishIndex].quantity > 1) {
            dishesCollection[dishIndex].quantity -= 1;
        } else {
            // if zero -> remove
            removeDishFromOrder(dishKeyword);
            return;
        }
        
        updateDishCardDisplay(dishKeyword);
        if (isOrderModalOpen) updateOrderModal();
    }
}

// dish q increase
function increaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    
    if (dishIndex !== -1) {
        dishesCollection[dishIndex].quantity += 1;
        updateDishCardDisplay(dishKeyword);
        if (isOrderModalOpen) updateOrderModal();
    }
}

// dish remove
function removeDishFromOrder(dishKeyword) {
    dishesCollection = dishesCollection.filter(item => item.keyword !== dishKeyword);
    updateDishCardDisplay(dishKeyword);
    if (isOrderModalOpen) updateOrderModal();
}

// show dishes card
function updateDishCardDisplay(dishKeyword) {
    const dishCard = document.querySelector(`.product-card[data-dish="${dishKeyword}"]`);
    if (!dishCard) return;
    
    const dishInOrder = dishesCollection.find(item => item.keyword === dishKeyword);
    const buttonContainer = dishCard.querySelector('p:last-child');
    
    if (dishInOrder) {
        //quantity controls
        buttonContainer.innerHTML = `
            <div class="quantity-controls">
                <button class="decrease-btn">-</button>
                <span class="quantity-display">${dishInOrder.quantity}</span>
                <button class="increase-btn">+</button>
            </div>
        `;
    } else {
        // show button-add
        buttonContainer.innerHTML = `<a class="button-add">Добавить</a>`;
    }
}

function toggleOrderModal() {
    if (isOrderModalOpen) {
        closeOrderModal();
    } else {
        openOrderModal();
    }
}

function openOrderModal() {
    const modal = document.querySelector('.order-modal-overlay');
    modal.style.display = 'flex';
    isOrderModalOpen = true;
    updateOrderModal();
}

function closeOrderModal() {
    const modal = document.querySelector('.order-modal-overlay');
    modal.style.display = 'none';
    isOrderModalOpen = false;
}

function updateOrderModal() {
    const orderItemsList = document.getElementById('order-items-list');
    const totalPriceElement = document.getElementById('modal-total-price');
    
    let totalPrice = 0;
    
    if (dishesCollection.length === 0) {
        orderItemsList.innerHTML = '<p class="empty-order-message">Ваш заказ пуст</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    let orderItemsHTML = '';
    
    dishesCollection.forEach(dish => {
        const dishTotal = dish.price * dish.quantity;
        totalPrice += dishTotal;
        
        orderItemsHTML += `
            <div class="order-item" data-dish="${dish.keyword}">
                <div class="order-item-info">
                    <span class="order-item-name">${dish.name}</span>
                    <span class="order-item-price">${dish.price} р. × ${dish.quantity} = ${dishTotal} р.</span>
                </div>
                <div class="order-item-controls">
                    <button class="modal-decrease-btn">-</button>
                    <span class="modal-quantity">${dish.quantity}</span>
                    <button class="modal-increase-btn">+</button>
                    <button class="modal-remove-btn">×</button>
                </div>
            </div>
        `;
    });
    
    orderItemsList.innerHTML = orderItemsHTML;
    totalPriceElement.textContent = totalPrice;
}

// Функция для кнопки "Оформить заказ" в модальном окне
function submitOrder() {
    if (dishesCollection.length === 0) {
        alert('Ваш заказ пуст!');
        return;
    }
    fillOrderForm();
    openOrderForm();
    closeOrderModal();
}

// Функция заполнения формы заказа
function fillOrderForm() {
    // Группируем блюда по категориям
    const orderedDishes = {
        soup: [],
        main: [],
        drink: []
    };
    
    dishesCollection.forEach(dish => {
        // Добавляем keyword нужное количество раз
        for (let i = 0; i < dish.quantity; i++) {
            if (orderedDishes[dish.category]) {
                orderedDishes[dish.category].push(dish.keyword);
            }
        }
    });
    
    // Создаем или обновляем скрытые поля в форме
    const orderForm = document.querySelector('.order-submit-form');
    if (!orderForm) return;
    
    // Удаляем старые скрытые поля заказа
    document.querySelectorAll('input[name^="soup_"], input[name^="main_"], input[name^="drink_"], input[name$="_count"], input[name="order_info"]').forEach(input => {
        input.remove();
    });
    
    // Добавляем новые поля для каждого блюда
    Object.keys(orderedDishes).forEach(category => {
        orderedDishes[category].forEach((keyword, index) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `${category}_${index + 1}`;
            input.value = keyword;
            orderForm.appendChild(input);
        });
    });
    
    // Добавляем поле с общим количеством блюд для каждой категории
    Object.keys(orderedDishes).forEach(category => {
        const countInput = document.createElement('input');
        countInput.type = 'hidden';
        countInput.name = `${category}_count`;
        countInput.value = orderedDishes[category].length;
        orderForm.appendChild(countInput);
    });
    
    // Добавляем поле с общей информацией о заказе
    const orderInfoInput = document.createElement('input');
    orderInfoInput.type = 'hidden';
    orderInfoInput.name = 'order_info';
    orderInfoInput.value = JSON.stringify(dishesCollection);
    orderForm.appendChild(orderInfoInput);
    
    console.log('Заказ подготовлен для отправки:', orderedDishes);
}

// Функция открытия формы заказа
function openOrderForm() {
    const orderSubmitSection = document.querySelector('.order-submit');
    if (orderSubmitSection) {
        orderSubmitSection.style.visibility = 'visible';
        orderSubmitSection.style.zIndex = '1000';
    }
}

function handleFormSubmit(event) {
    if (dishesCollection.length === 0) {
        alert('Добавьте блюда в заказ перед отправкой!');
        event.preventDefault();
        return;
    }
    
    fillOrderForm();
    dishesCollection = [];
    document.querySelectorAll('.product-card').forEach(card => {
        const dishKeyword = card.getAttribute('data-dish');
        updateDishCardDisplay(dishKeyword);
    });
    closeOrderForm();
    
}


function closeOrderForm() {
    const orderSubmitSection = document.querySelector('.order-submit');
    if (orderSubmitSection) {
        orderSubmitSection.style.visibility = 'hidden';
        orderSubmitSection.style.zIndex = '-1';
    }
}