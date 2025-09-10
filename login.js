//Login form buttons
let login_button= document.getElementsByClassName('login-button')[0]
let login_form = document.getElementsByClassName('login-form')[0]
let close_button = document.getElementsByClassName("close-button")[0]

login_button.addEventListener('click', function(event) {
    login_form.style.cssText = 'z-index:1; visibility: visible';
})

close_button.addEventListener('click', function(event) {
    login_form.style.cssText = 'z-index:-1; visibility:hidden';
})

//Feedback form buttons

let block_footer_ref = document.getElementsByClassName('block-footer-ref')[1];
let feedback_form = document.getElementsByClassName('feedback-form')[0]
let close_button_feedback = document.getElementsByClassName("close-button-feedback")[0];


block_footer_ref.addEventListener('click', function(event) {
    feedback_form.style.cssText = "z-index:1; visibility:visible";
})

close_button_feedback.addEventListener('click', function(event) {
    feedback_form.style.cssText = "z-index: -1; visibility:hidden";
})


//autocomplite submit
// all methods are not working
let autocomplete_submit = document.getElementsByClassName('autocomplete-submit')[0];
let loging_field = document.getElementsByClassName('login-field')[0];
let password_field = document.getElementsByClassName('password-field')[0];
//alert (autocomplete_submit.checked = true);
password_field.addEventListener('focus', function(event){
    password_field.setAttribute("type", "text");
})

password_field.addEventListener('blur', function(event){
    password_field.setAttribute("type", "password");
})

autocomplete_submit.addEventListener ('click', function(event){
    event.defaultPrevented();
})


autocomplete_submit.addEventListener('click', function(event) {
    if (autocomplete_submit.checked === true) {
        loging_field.setAttribute("autocomplite", "on");
        password_field.setAttribute("autocomplite", "current-password");
        enablePasswordSaving();
    } else {
        loging_field.readonly = true;
        loging_field.setAttribute("autocompite", "off");
        password_field.setAttribute("autocomplite", "new-password");
        disablePasswordSaving();
    }
})