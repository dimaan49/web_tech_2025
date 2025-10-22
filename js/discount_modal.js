// short file modal win
// if active combo -> show discount modal, if zero -> message. send the form
function handleFormSubmit(event) {
    const activeCombo = checkForComboDiscount();
    
    if (activeCombo) {
        event.preventDefault();
        showDiscountModal(activeCombo);
        
        const originalSubmit = function() {
            fillOrderForm();
            dishesCollection = [];
            document.querySelectorAll('.product-card').forEach(card => {
                const dishKeyword = card.getAttribute('data-dish');
                updateDishCardDisplay(dishKeyword);
            });
            closeOrderForm();
            document.querySelector('.order-submit-form').submit();
        };
        
        document.querySelector('.discount-ok-btn').onclick = function() {
            closeDiscountModal();
            setTimeout(originalSubmit, 100);
        };
        
        return;
    }
    
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