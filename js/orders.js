class OrdersManager {
    constructor() {
        this.orders = this.loadOrders();
        this.currentOrderId = null;
        this.init();
    }

    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
        return orders;
    }

    init() {
        this.displayOrders();
        this.setupEventListeners();
    }

    displayOrders() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) {
            console.log('Orders list not found');
            return;
        }

        if (this.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <p>У вас пока нет заказов</p>
                    <a href="menu.html" class="btn-primary">Сделать первый заказ</a>
                </div>
            `;
            return;
        }

        const sortedOrders = this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        ordersList.innerHTML = '';
        
        sortedOrders.forEach((order, index) => {
            const orderCard = this.createOrderCard(order, index + 1);
            ordersList.appendChild(orderCard);
        });
    }

    createOrderCard(order, orderNumber) {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.setAttribute('data-order-id', order.id);
        
        card.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-number">Заказ #${orderNumber}</span>
                    <span class="order-date">${this.formatDate(order.date)}</span>
                </div>
            </div>
            <div class="order-content">
                <div class="order-dishes">${this.getDishesList(order.dishes)}</div>
                <div class="order-price">${order.totalPrice} р.</div>
                <div class="order-delivery">${this.getDeliveryInfo(order)}</div>
            </div>
            <div class="order-actions">
                <button class="btn-action btn-details" data-order-id="${order.id}" title="Подробнее">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-edit" data-order-id="${order.id}" title="Редактировать">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" data-order-id="${order.id}" title="Удалить">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        card.querySelector('.btn-details').addEventListener('click', () => this.showOrderDetails(order.id));
        card.querySelector('.btn-edit').addEventListener('click', () => this.showEditForm(order.id));
        card.querySelector('.btn-delete').addEventListener('click', () => this.showDeleteConfirmation(order.id));
        
        return card;
    }

    getDishesList(dishes) {
        return dishes.map(dish => dish.name).join(', ');
    }

    getDeliveryInfo(order) {
        return order.deliveryType === 'asap' ? 'Доставка как можно скорее' : `Доставка к ${this.formatTime(order.deliveryTime)}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modalContent = document.getElementById('details-content');
        modalContent.innerHTML = `
            <div class="order-details">
                <div class="detail-group">
                    <h3>Информация о получателе</h3>
                    <p><strong>ФИО:</strong> ${order.fullName}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Телефон:</strong> ${order.phone}</p>
                    <p><strong>Адрес:</strong> ${order.address}</p>
                </div>
                
                <div class="detail-group">
                    <h3>Состав заказа</h3>
                    <div class="order-dishes-list">
                        ${order.dishes.map(dish => `
                            <div class="order-dish-item">
                                <span>${dish.name}</span>
                                <span>${dish.quantity} × ${dish.price} р.</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-total">
                        <strong>Итого: ${order.totalPrice} р.</strong>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3>Информация о доставке</h3>
                    <p><strong>Тип доставки:</strong> ${order.deliveryType === 'asap' ? 'Как можно скорее' : 'Ко времени'}</p>
                    <p><strong>Время:</strong> ${order.deliveryType === 'asap' ? 'Как можно скорее' : this.formatTime(order.deliveryTime)}</p>
                    ${order.comment ? `<p class="order-comment"><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
                </div>
            </div>
        `;
        
        this.showModal('details-modal');
    }

    showEditForm(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        this.currentOrderId = orderId;
        
        const editForm = document.getElementById('edit-form');
        editForm.innerHTML = `
            <div class="form-group">
                <label>ФИО</label>
                <input type="text" name="fullName" value="${order.fullName}" required>
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="${order.email}" required>
            </div>
            
            <div class="form-group">
                <label>Телефон</label>
                <input type="tel" name="phone" value="${order.phone}" required>
            </div>
            
            <div class="form-group">
                <label>Адрес доставки</label>
                <input type="text" name="address" value="${order.address}" required>
            </div>
            
            <div class="form-group">
                <label>Тип доставки</label>
                <select name="deliveryType" required>
                    <option value="asap" ${order.deliveryType === 'asap' ? 'selected' : ''}>Как можно скорее</option>
                    <option value="scheduled" ${order.deliveryType === 'scheduled' ? 'selected' : ''}>Ко времени</option>
                </select>
            </div>
            
            <div class="form-group" id="delivery-time-group" style="${order.deliveryType === 'scheduled' ? 'display: block;' : 'display: none;'}">
                <label>Время доставки</label>
                <input type="datetime-local" name="deliveryTime" value="${order.deliveryTime ? new Date(order.deliveryTime).toISOString().slice(0, 16) : ''}">
            </div>
            
            <div class="form-group">
                <label>Комментарий к заказу</label>
                <textarea name="comment">${order.comment || ''}</textarea>
            </div>
        `;

        const deliveryTypeSelect = editForm.querySelector('select[name="deliveryType"]');
        const deliveryTimeGroup = editForm.querySelector('#delivery-time-group');
        
        deliveryTypeSelect.addEventListener('change', (e) => {
            deliveryTimeGroup.style.display = e.target.value === 'scheduled' ? 'block' : 'none';
        });
        
        this.showModal('edit-modal');
    }

    showDeleteConfirmation(orderId) {
        this.currentOrderId = orderId;
        this.showModal('delete-modal');
    }

    setupEventListeners() {
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalType = e.target.getAttribute('data-modal');
                this.hideModal(`${modalType}-modal`);
            });
        });
        
        document.querySelector('.btn-ok').addEventListener('click', () => {
            this.hideModal('details-modal');
        });
        
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalType = e.target.getAttribute('data-modal');
                this.hideModal(`${modalType}-modal`);
            });
        });
        
        document.querySelector('.btn-save').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveOrderChanges();
        });
        
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.deleteOrder();
        });
        
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideModal(overlay.id);
                }
            });
        });
    }

    saveOrderChanges() {
        const form = document.getElementById('edit-form');
        const formData = new FormData(form);
        
        const updatedOrder = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            deliveryType: formData.get('deliveryType'),
            comment: formData.get('comment')
        };
        
        if (updatedOrder.deliveryType === 'scheduled') {
            updatedOrder.deliveryTime = formData.get('deliveryTime');
        }
        
        const orderIndex = this.orders.findIndex(o => o.id === this.currentOrderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex] = { ...this.orders[orderIndex], ...updatedOrder };
            this.saveToLocalStorage();
            this.displayOrders();
            this.hideModal('edit-modal');
            this.showNotification('Заказ успешно изменён', 'success');
        }
    }

    deleteOrder() {
        this.orders = this.orders.filter(order => order.id !== this.currentOrderId);
        this.saveToLocalStorage();
        this.displayOrders();
        this.hideModal('delete-modal');
        this.showNotification('Заказ успешно удалён', 'success');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentOrderId = null;
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('userOrders', JSON.stringify(this.orders));
    }

    addNewOrder(orderData) {
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...orderData
        };
        
        this.orders.unshift(newOrder);
        this.saveToLocalStorage();
        this.displayOrders();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new OrdersManager();
});