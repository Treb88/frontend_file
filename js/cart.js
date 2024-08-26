// handle import of functions
import { cart,
        updateCartUI,
        orderSubmitted,
        updateCheckoutUI,
        payNowBtn, 
        removeItemFromCart, 
        savetoCartStorage,  
        updateOrderDisplay
} from "./cartData.js";

// render items added to cart storage
const productList = document.querySelector('.js-cart-item');
productList.innerHTML = '';
cart.forEach(cartItem => {
    const productItem = `
            <div class="cart-item js-cart-item-table-${cartItem.id}">
                <div class="cart-product-image">
                    <img src="${cartItem.image}" alt="${cartItem.name}">
                </div>
                <div class="cart-details">
                    <p>${cartItem.name}</p>
                    <p>${cartItem.description}</p>
                    <p class="cart-price">₱ ${cartItem.price.toFixed(2)}</p>
                    <div class="cart-actions">
                        <input class="js-input-quantity" 
                                data-product-id="${cartItem.id}"
                                type="number" 
                                min="1" 
                                value="${cartItem.quantity}" 
                                oninput="validity.valid||(value='');">
                        <button class="remove-item js-remove-item" 
                        data-product-id=${cartItem.id}>
                        R
                        </button>
                    </div>
                </div>
            </div>`;
                productList.innerHTML += productItem;
});

// handle item qunatity update
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('js-input-quantity')) {
        const productId = 
        event.target.getAttribute('data-product-id');
        let newQuantity = 
        parseInt(event.target.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
            event.target.value;
        };
        const productIndex = 
        cart.findIndex(cartItem => cartItem.id === productId);
        if (productIndex !== -1) {
            if (newQuantity > 0) {
                cart[productIndex].quantity = newQuantity;
            }
        };        
        savetoCartStorage();
        updateCartUI();
    };    
});


// romoving item from cart storage
document.querySelectorAll('.js-remove-item')
    .forEach((removeItemBtn) => {
        removeItemBtn.addEventListener('click', () => {
            const productId = removeItemBtn.dataset.productId;            
            const container = document.querySelector
            (`.js-cart-item-table-${productId}`);            
            container.remove();
            
            removeItemFromCart(productId);
            updateCheckoutUI();
            updateCartUI();            
        });        
    });

    // Attach event listener to the "Proceed to Checkout" button
document.querySelector('.js-pay-now').addEventListener('click', function() {
    const checkoutForm = document.querySelector('.js-checkout-form');
    const proceedToCheckoutButton = document.querySelector('.js-pay-now');

    // Show the checkout form and hide the "Proceed to Checkout" button
    checkoutForm.style.display = 'block';
    proceedToCheckoutButton.style.display = 'none';
});



// handle input filed and ordersubmitted storage
/* document.addEventListener('DOMContentLoaded', () => {
    const proceedBtn = document.querySelector('.js-pay-now');

    isCartEmpty(proceedBtn);    

    proceedBtn.addEventListener('click', () => {
    const customerForm = document.querySelector('.js-checkout-form');
    customerForm.innerHTML = `
                    <div>
                        <span>Full Name</span>
                        <input type="text" class="js-full-name">
                    </div>
                    <div>
                        <span>Mobile Number</span>
                        <input type="number" class="js-mobile-number">
                    </div>
                    <div>
                        <button class="pay-now js-submit-pay-now">
                        Pay Now
                        </button>
                    </div>`;

    proceedBtn.style.display = 'none';

    document.querySelector('.js-submit-pay-now')
            .addEventListener('click', () => {
                    payNowBtn();
        });
        
    });
    
}); */

document.querySelector('.js-submit-pay-now')
            .addEventListener('click', () => {
                    payNowBtn();
        });

// Event delegation for dynamically generated cancel buttons
document.querySelector('.js-your-order').addEventListener('click', function(event) {
    if (event.target.classList.contains('js-cancel-order')) {
        const orderRecord = event.target.closest('.js-order-record');
        const orderIndex = orderRecord.getAttribute('data-order-index');

        // Remove the order from the array
        orderSubmitted.splice(orderIndex, 1);

        /* // Update local storage
        localStorage.setItem('orderSubmitted', JSON.stringify(orderSubmitted)); */

        // Update the order display after removing the order
        updateOrderDisplay();
        savetoCartStorage();
    }
});

        
updateCheckoutUI();
updateOrderDisplay();
savetoCartStorage();
updateCartUI();
    
    