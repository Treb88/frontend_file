document.addEventListener("DOMContentLoaded", function() {
    const productList = document.getElementById('product-list');
    const cartCounter = document.querySelector('.cart-counter span');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCounter() {
        cartCounter.textContent = cart.length;
    }

    function addToCart(product, mobileNumber) {
        const cartItem = {
            ...product,
            mobileNumber,
            quantity: 1 // Default quantity
        };
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div class="image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="details">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p class="price">₱ ${(product.price / 100).toFixed(2)}</p>
                <div class="detailsAction">
                    <input type="text" placeholder="Enter recipient mobile number here" class="client-name">
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;

        const addToCartButton = productItem.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => {
            const mobileNumber = productItem.querySelector('.client-name').value;
            if (mobileNumber.trim() === '') {
                alert('Please enter a recipient mobile number.');
                return;
            }
            addToCart(product, mobileNumber);
            productItem.querySelector('.client-name').value = '';
        });

        productList.appendChild(productItem);
    });

    updateCartCounter();
});
