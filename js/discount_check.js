function triggerDishesCollectionUpdate() {
    const event = new CustomEvent('dishesCollectionUpdated');
    document.dispatchEvent(event);
}

function initializeComboSystem() {
    updateComboIndicators();
    
    document.addEventListener('dishesCollectionUpdated', updateComboIndicators);
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('discount-ok-btn')) {
            closeDiscountModal();
        }
    });
}

function updateComboIndicators() {
    const selectedCategories = getSelectedCategories();
    
    document.querySelectorAll('.combo-card').forEach(card => {
        card.classList.remove('active-combo');
    });
    
    document.querySelectorAll('.combo-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    
    document.querySelectorAll('.combo-card').forEach(card => {
        const comboId = card.getAttribute('data-combo');
        const icons = card.querySelectorAll('.combo-icon');
        let allIconsActive = true;

        
        
        icons.forEach(icon => {
            const type = icon.getAttribute('data-type');
            const isActive = selectedCategories[type] === 1;
            
            if (isActive) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
                allIconsActive = false;
            }
        });
        
        if (allIconsActive && comboId !== '6') {
            card.classList.add('active-combo');
        }
    });
}

function getSelectedCategories() {
    const categories = {
        'soup': 0,
        'main': 0, 
        'starter': 0,
        'drink': 0,
        'dessert': 0
    };
    
    dishesCollection.forEach(dish => {
        categories[dish.category]++;
    });
    
    return categories;
}

function checkForComboDiscount() {
    const selectedCategories = getSelectedCategories();
    
    const combos = [
        { id: 1, types: ['soup', 'main', 'starter', 'drink'] },
        { id: 2, types: ['soup', 'main', 'drink'] },
        { id: 3, types: ['soup', 'starter', 'drink'] },
        { id: 4, types: ['main', 'starter', 'drink'] },
        { id: 5, types: ['main', 'drink'] }
    ];
    
    for (let combo of combos) {
        const isComboComplete = combo.types.every(type => 
            selectedCategories[type] === 1
        );
        
        if (isComboComplete) {
            return combo.id;
        }
    }
    
    return null;
}

function showDiscountModal(comboId) {
    const modal = document.querySelector('.discount-modal-overlay');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDiscountModal() {
    const modal = document.querySelector('.discount-modal-overlay');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeComboSystem();
});