// local storage
let cart = JSON.parse(localStorage.getItem('cartItem')) || [];
let orderSubmitted = JSON.parse(localStorage.getItem('orderSubmittedItem')) || [];


console.log(cart);
console.log(orderSubmitted);

/* cart = []; */
/* orderSubmitted = []; */

// saveing to local storage function
function savetoCartStorage() {
    localStorage.setItem('cartItem', JSON.stringify(cart));
    localStorage.setItem('orderSubmittedItem', JSON.stringify(orderSubmitted));
};

// adding items to cart storage function
/* function addToCart(productData, productId) {
    const matchingProductIndex = cart.findIndex(cartItem =>
        cartItem.id === productId);

        if (matchingProductIndex !== -1) {
            cart[matchingProductIndex].quantity += 1;
        } else {
            cart.push(productData);
        };
    savetoCartStorage();
}; */

// Function to handle adding a product to the cart
function addToCart(product) {
    // Check if the product already exists in the cart by comparing product IDs
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Product already exists in the cart, so increase the quantity
        cart[existingProductIndex].quantity += 1;
        cart[existingProductIndex].totalPrice += product.price.toFixed(2); // Update the total price
    } else {
        // Product does not exist in the cart, so add it as a new entry with quantity 1
        product.quantity = 1; // Add a quantity property to the product
        product.totalPrice = product.price; // Initialize total price for this product
        cart.push(product);
    }

    // Optionally, you can display the cart contents or update the UI to reflect the added item
   /*  console.log('Product added to cart:', product);
    console.log('Current cart:', cart); */

    // Update total price or cart count on the UI if necessary
    updateCartUI();
    savetoCartStorage();
}

// checking if cart is empty function
/* function isCartEmpty(proceedBtn) {
    if (cart.length === 0) {
        proceedBtn.style.display = 'none';
    } else {
        proceedBtn.style.display = 'block';
    };
};
 */
// updating cart counter function
/* function updateCartCounter() {
    const cartCounter = cart.reduce((total, cartItem) => 
        total + cartItem.quantity, 0);
    document.querySelector('.js-cart-counter').textContent = cartCounter;
    savetoCartStorage();
};
 */
// calculate total price
/* function totalPriceCalculator() {    
    const totalPrice = cart.reduce((total, cartItem) => 
        total + (cartItem.price * cartItem.quantity), 0);
    document.querySelector('.js-cart-total-price').textContent = `₱ ${totalPrice.toFixed(2)}`;
    
    savetoCartStorage();
}; */


// Function to update the UI after a product is added to the cart
function updateCartUI() {
    // For example, update cart count, display cart contents, or total price on the page
    const cartCountElement = document.querySelector('.js-cart-counter');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
        cartCountElement.textContent = totalItems; // Update the cart count on the UI
    }

    const cartTotalElement = document.querySelector('.js-cart-total-price');
    if (cartTotalElement) {
        const totalPrice = cart.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0).toFixed(2);
        cartTotalElement.textContent = `₱ ${totalPrice}`; // Update the total price on the UI
    }
    savetoCartStorage();
}

// removing item from cart or reassigning cart to newcart function
function removeItemFromCart(productId) {
    /* const customerForm = document.querySelector('.js-pay-now'); */
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.id !== productId) {
            newCart.push(cartItem);
        };
    });
    cart = newCart;
    /* customerForm.style.display = 'none'; */
    savetoCartStorage();
    updateCartUI();
};

// Function to manage the visibility of the checkout elements
function updateCheckoutUI() {
    const checkoutForm = document.querySelector('.js-checkout-form');
    const proceedToCheckoutButton = document.querySelector('.js-pay-now');
    const checkoutFormContainer = document.querySelector('.checkout-form');

    if (cart.length === 0) {
        // Hide the entire checkout form block if the cart is empty
        checkoutFormContainer.style.display = 'none';
    } else {
        // Show the "Proceed to Checkout" button and hide the checkout form initially
        checkoutFormContainer.style.display = 'block';
        checkoutForm.style.display = 'none';
        proceedToCheckoutButton.style.display = 'block';
    }
}

// submitting order function
function payNowBtn() {
    /* if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }; */

    const cartItem = cart;
    const customerForm = document.querySelector('.js-checkout-form');
    const clientNameInput = document.querySelector('.js-full-name').value;
    const clientMobileNumberInput = document.querySelector('.js-mobile-number').value;
    
    if (clientNameInput === '' || clientMobileNumberInput === '') {
        alert('Please fill in both the Full Name and Mobile Number fields before proceeding.');
        return; // Stop the function if validation fails
    }

    // Prepare the order data based on the existing cart
    const order = {
        clientName: clientNameInput,
        clientMobile: clientMobileNumberInput,
        products: cart.map(cartItem => ({
            productId: cartItem.id,
            productName: cartItem.name,  // Use productId from the cart
            quantity: cartItem.quantity,  // Use quantity from the cart
            price: cartItem.price,
            category: cartItem.category,
            productImage: cartItem.image   // Use totalPrice (which is already the total for this item)
        })),
        totalPrice: cart.reduce((total, cartItem) => 
            total + (cartItem.price * cartItem.quantity), 0) // Calculate the total price of the entire cart
    };

    
    orderSubmitted.push(order);

    cart.length = 0;

    document.querySelector('.js-cart-item').textContent = cartItem;
    customerForm.style.display = 'none';

    
    updateOrderDisplay();
    savetoCartStorage();
    updateCartUI();
};

function updateOrderDisplay() {
    const ordersubmittedList = document.querySelector('.js-your-order');
    ordersubmittedList.innerHTML = '';  // Clearing previous entries

    orderSubmitted.forEach((orderItem, index) => {
        const transactionItems = orderItem.products.map(product => {
            const redeemCodeHTML = product.category === 'Voucher' 
                ? `<span class="redeem-code">Your Voucher Code</span>` 
                : '';
            return `
                <div class="order-item">
                    <div class="order-product-image">
                        <img src="${product.productImage}" alt="${product.productName}">
                    </div>
                    <div class="order-details">
                        <p>${product.productName}</p>
                        <span>Qty: ${product.quantity}</span>
                        <p>${product.price.toFixed(2)}</p>
                        ${redeemCodeHTML}
                    </div>
                </div>
            `;
        }).join('');  // Using map and join to create HTML string

        const ordersubmittedItems = `
        <div class="order-record js-order-record" data-order-index="${index}">
            <div class="order-item-list js-order-item-list">            
                    ${transactionItems}            
            </div>
            <div class="order-actions">
                <div class="order-total">
                    <span>Total Price:</span>
                    <span>₱ ${orderItem.totalPrice.toFixed(2)}</span>
                </div>
                <div class="order-footer">
                    <span class="order-status-pending">pending</span>
                    <button class="cancel-order js-cancel-order">Cancel</button>
                </div>
            </div>
        </div>
        `;

        // Append the complete HTML string for all items at once
        ordersubmittedList.insertAdjacentHTML('beforeend', ordersubmittedItems);
    });
}

// handle export of function
export {cart,
        orderSubmitted,
        addToCart,
        updateCartUI,
        updateCheckoutUI, 
        removeItemFromCart, 
        savetoCartStorage,        
        payNowBtn,
        updateOrderDisplay
};