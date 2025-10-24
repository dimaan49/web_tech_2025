let dishesCollection = [];
let isOrderModalOpen = false;

function saveDishesToLocalStorage() {
    const simplifiedCollection = dishesCollection.map(dish => ({
        keyword: dish.keyword,
        quantity: dish.quantity
    }));
    localStorage.setItem('dishesCollection', JSON.stringify(simplifiedCollection));
}

function loadDishesFromLocalStorage() {
    const saved = localStorage.getItem('dishesCollection');
    if (!saved) return;

    try {
        const simplifiedCollection = JSON.parse(saved);
        dishesCollection = simplifiedCollection.map(item => {
            const dish = window.dishes.find(d => d.keyword === item.keyword);
            return dish ? { ...dish, quantity: item.quantity } : null;
        }).filter(item => item !== null);
        updateAllDishCards();
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        dishesCollection = [];
    }
}

function clearDishesFromLocalStorage() {
    localStorage.removeItem('dishesCollection');
}

function initializeAfterAPILoad() {
    if (typeof window.dishes !== 'undefined' && window.dishes.length > 0) {
        loadDishesFromLocalStorage();
    } else {
        setTimeout(initializeAfterAPILoad, 500);
    }
}

function updateAllDishCards() {
    dishesCollection.forEach(dish => {
        updateDishCardDisplay(dish.keyword);
    });
}

function initializeOrderFunctionality() {
    document.addEventListener('click', function(event) {
        const target = event.target;
        const dishCard = target.closest('.product-card');
        const dishKeyword = dishCard?.getAttribute('data-dish');

        if (target.classList.contains('button-add') && dishKeyword) {
            addDishToOrder(dishKeyword);
        } else if (target.classList.contains('decrease-btn') && dishKeyword) {
            decreaseDishQuantity(dishKeyword);
        } else if (target.classList.contains('increase-btn') && dishKeyword) {
            increaseDishQuantity(dishKeyword);
        } else if (target.classList.contains('button-view-order')) {
            event.preventDefault();
            toggleOrderModal();
        } else if (target.classList.contains('modal-decrease-btn')) {
            const dishItem = target.closest('.order-item');
            const modalDishKeyword = dishItem?.getAttribute('data-dish');
            if (modalDishKeyword) {
                decreaseDishQuantity(modalDishKeyword);
                updateOrderModal();
            }
        } else if (target.classList.contains('modal-increase-btn')) {
            const dishItem = target.closest('.order-item');
            const modalDishKeyword = dishItem?.getAttribute('data-dish');
            if (modalDishKeyword) {
                increaseDishQuantity(modalDishKeyword);
                updateOrderModal();
            }
        } else if (target.classList.contains('modal-remove-btn')) {
            const dishItem = target.closest('.order-item');
            const modalDishKeyword = dishItem?.getAttribute('data-dish');
            if (modalDishKeyword) {
                removeDishFromOrder(modalDishKeyword);
                updateOrderModal();
            }
        } else if (target.classList.contains('close-order-modal') || target.classList.contains('order-modal-overlay')) {
            closeOrderModal();
        } else if (target.classList.contains('continue-shopping-btn')) {
            event.preventDefault();
            closeOrderModal();
        } else if (target.classList.contains('close-button-order')) {
            closeOrderForm();
        } else if (target.classList.contains('button-submit-order')) {
            event.preventDefault();
            submitOrderForm();
        }
    });

    const orderForm = document.querySelector('.order-submit-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitOrderForm();
        });
    }
}

function addDishToOrder(dishKeyword) {
    const dish = window.dishes.find(d => d.keyword === dishKeyword);
    if (!dish) return;

    const existingDish = dishesCollection.find(item => item.keyword === dishKeyword);
    if (existingDish) {
        existingDish.quantity += 1;
    } else {
        dishesCollection.push({ ...dish, quantity: 1 });
    }

    updateDishCardDisplay(dishKeyword);
    saveDishesToLocalStorage();
}

function decreaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    if (dishIndex === -1) return;

    if (dishesCollection[dishIndex].quantity > 1) {
        dishesCollection[dishIndex].quantity -= 1;
        updateDishCardDisplay(dishKeyword);
        saveDishesToLocalStorage();
        if (isOrderModalOpen) updateOrderModal();
    } else {
        removeDishFromOrder(dishKeyword);
    }
}

function increaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    if (dishIndex === -1) return;

    dishesCollection[dishIndex].quantity += 1;
    updateDishCardDisplay(dishKeyword);
    saveDishesToLocalStorage();
    if (isOrderModalOpen) updateOrderModal();
}

function removeDishFromOrder(dishKeyword) {
    dishesCollection = dishesCollection.filter(item => item.keyword !== dishKeyword);
    updateDishCardDisplay(dishKeyword);
    saveDishesToLocalStorage();
    if (isOrderModalOpen) updateOrderModal();
}

function updateDishCardDisplay(dishKeyword) {
    const dishCard = document.querySelector(`.product-card[data-dish="${dishKeyword}"]`);
    if (!dishCard) return;

    const dishInOrder = dishesCollection.find(item => item.keyword === dishKeyword);
    const buttonContainer = dishCard.querySelector('p:last-child');

    if (dishInOrder) {
        buttonContainer.innerHTML = `
            <div class="quantity-controls">
                <button class="decrease-btn">-</button>
                <span class="quantity-display">${dishInOrder.quantity}</span>
                <button class="increase-btn">+</button>
            </div>
        `;
    } else {
        buttonContainer.innerHTML = `<a class="button-add">Добавить</a>`;
    }
}

function toggleOrderModal() {
    isOrderModalOpen ? closeOrderModal() : openOrderModal();
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

    if (dishesCollection.length === 0) {
        orderItemsList.innerHTML = '<p class="empty-order-message">Ваш заказ пуст</p>';
        totalPriceElement.textContent = '0';
        return;
    }

    let orderItemsHTML = '';
    let totalPrice = 0;

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

function openOrderForm() {
    const orderSubmitSection = document.querySelector('.order-submit');
    if (orderSubmitSection) {
        orderSubmitSection.style.visibility = 'visible';
        orderSubmitSection.style.zIndex = '1000';
    }
}

function closeOrderForm() {
    const orderSubmitSection = document.querySelector('.order-submit');
    if (orderSubmitSection) {
        orderSubmitSection.style.visibility = 'hidden';
        orderSubmitSection.style.zIndex = '-1';
    }
}

function submitOrderForm() {
    if (dishesCollection.length === 0) {
        alert('Добавьте блюда в заказ перед отправкой!');
        return false;
    }

    const orderData = {
        fullName: document.querySelector('input[name="full_name"]').value,
        email: document.querySelector('input[name="email"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        address: document.querySelector('input[name="address"]').value,
        deliveryType: 'asap',
        deliveryTime: new Date().toISOString(),
        dishes: JSON.parse(JSON.stringify(dishesCollection)),
        totalPrice: calculateTotalPrice()
    };

    let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    orders.unshift({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...orderData
    });
    
    localStorage.setItem('userOrders', JSON.stringify(orders));
    

    dishesCollection = [];
    clearDishesFromLocalStorage();
    updateOrderModal();
    updateAllDishCards();
    closeOrderForm();
    
    alert('Заказ успешно оформлен! Корзина очищена.');
    
    return false;
}

function calculateTotalPrice() {
    return dishesCollection.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
}


document.addEventListener('DOMContentLoaded', function() {
    initializeOrderFunctionality();
    initializeAfterAPILoad();
});

window.restoreCartAfterAPILoad = function() {
    if (typeof window.dishes !== 'undefined' && window.dishes.length > 0) {
        loadDishesFromLocalStorage();
    }
};