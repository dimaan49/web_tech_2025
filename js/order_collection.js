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
        
        if (event.target.classList.contains('button-view-order')) {
            event.preventDefault();
            toggleOrderModal();
        }
        
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
        
        if (event.target.classList.contains('close-order-modal') || 
            event.target.classList.contains('order-modal-overlay')) {
            closeOrderModal();
        }
        
        if (event.target.classList.contains('submit-order-btn')) {
            event.preventDefault();
            submitOrder();
        }
        
        if (event.target.classList.contains('continue-shopping-btn')) {
            event.preventDefault();
            closeOrderModal();
        }
        
        if (event.target.classList.contains('close-button-order')) {
            closeOrderForm();
        }
        
        if (event.target.classList.contains('button-submit-order')) {
            event.preventDefault();
            const orderForm = document.querySelector('.order-submit-form');
            if (orderForm) {
                const submitEvent = new Event('submit', { cancelable: true });
                orderForm.dispatchEvent(submitEvent);
            }
        }
    });
    
    const orderForm = document.querySelector('.order-submit-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }
}

function addDishToOrder(dishKeyword) {
    const dish = dishes.find(d => d.keyword === dishKeyword);
    if (!dish) return;
    
    const existingDish = dishesCollection.find(item => item.keyword === dishKeyword);
    
    if (existingDish) {
        existingDish.quantity += 1;
    } else {
        dishesCollection.push({
            ...dish,
            quantity: 1
        });
    }
    
    updateDishCardDisplay(dishKeyword);
    triggerDishesCollectionUpdate();
}

function decreaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    
    if (dishIndex !== -1) {
        if (dishesCollection[dishIndex].quantity > 1) {
            dishesCollection[dishIndex].quantity -= 1;
        } else {
            removeDishFromOrder(dishKeyword);
            return;
        }
        
        updateDishCardDisplay(dishKeyword);
        if (isOrderModalOpen) updateOrderModal();
    }
}

function increaseDishQuantity(dishKeyword) {
    const dishIndex = dishesCollection.findIndex(item => item.keyword === dishKeyword);
    
    if (dishIndex !== -1) {
        dishesCollection[dishIndex].quantity += 1;
        updateDishCardDisplay(dishKeyword);
        if (isOrderModalOpen) updateOrderModal();
    }
}

function removeDishFromOrder(dishKeyword) {
    dishesCollection = dishesCollection.filter(item => item.keyword !== dishKeyword);
    updateDishCardDisplay(dishKeyword);
    triggerDishesCollectionUpdate();
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

function submitOrder() {
    if (dishesCollection.length === 0) {
        alert('Ваш заказ пуст!');
        return;
    }
    fillOrderForm();
    openOrderForm();
    closeOrderModal();
}

function fillOrderForm() {
    const orderedDishes = {
        soup: [],
        main: [],
        drink: []
    };
    
    dishesCollection.forEach(dish => {
        for (let i = 0; i < dish.quantity; i++) {
            if (orderedDishes[dish.category]) {
                orderedDishes[dish.category].push(dish.keyword);
            }
        }
    });
    
    const orderForm = document.querySelector('.order-submit-form');
    if (!orderForm) return;
    
    document.querySelectorAll('input[name^="soup_"], input[name^="main_"], input[name^="drink_"], input[name$="_count"], input[name="order_info"]').forEach(input => {
        input.remove();
    });
    
    Object.keys(orderedDishes).forEach(category => {
        orderedDishes[category].forEach((keyword, index) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `${category}_${index + 1}`;
            input.value = keyword;
            orderForm.appendChild(input);
        });
    });
    
    Object.keys(orderedDishes).forEach(category => {
        const countInput = document.createElement('input');
        countInput.type = 'hidden';
        countInput.name = `${category}_count`;
        countInput.value = orderedDishes[category].length;
        orderForm.appendChild(countInput);
    });
    
    const orderInfoInput = document.createElement('input');
    orderInfoInput.type = 'hidden';
    orderInfoInput.name = 'order_info';
    orderInfoInput.value = JSON.stringify(dishesCollection);
    orderForm.appendChild(orderInfoInput);
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