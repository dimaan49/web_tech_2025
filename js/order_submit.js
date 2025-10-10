// open the order submit
let order_submit = document.getElementsByClassName("order-submit")[0];
let order_main_ref = document.getElementsByClassName("order-main-ref")[0];

order_main_ref.addEventListener('click', function(event) {
    order_submit.style.cssText = "z-index:1; visibility: visible";
})

// close the order submit
let close_button_order = document.getElementsByClassName("close-button-order")[0];

close_button_order.addEventListener('click', function(event) {
    order_submit.style.cssText = "z-index:0; visibility: hidden";
})

