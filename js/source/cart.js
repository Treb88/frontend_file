document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCounter = document.querySelector('.cart-counter span');
    const pendingStatusContainer = document.querySelector('.pending-status');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let pending = JSON.parse(localStorage.getItem('pending')) || [];

    // Function to update the cart counter in the header
    function updateCartCounter() {
        cartCounter.textContent = cart.length;
    }

    // Function to update the total price displayed in the cart
    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity / 100), 0);
        totalPriceElement.textContent = `₱ ${totalPrice.toFixed(2)}`;
    }

    // Function to render the cart items on the cart page
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span><img src="${item.image}" alt="${item.name}"></span>
                <span>${item.quantity}</span>
                <span>₱ ${(item.price / 100).toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">R</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCounter();
                updateTotalPrice();
            });
        });

        updateTotalPrice();
    }

    // Function to render the pending transactions
    function renderPendingItems() {
        pendingStatusContainer.innerHTML = '';
        pending.forEach(transaction => {
            const pendingItem = document.createElement('div');
            pendingItem.className = 'pending-item';

            // Create a set of unique product images
            const uniqueItems = transaction.items.reduce((unique, item) => {
                if (!unique.some(uniqueItem => uniqueItem.id === item.id)) {
                    unique.push(item);
                }
                return unique;
            }, []);

            // Generate HTML for the unique product images
            const imagesHtml = uniqueItems.map(item => `<img src="${item.image}" alt="${item.name}" title="${item.name}">`).join(' ');

            const totalPrice = transaction.items.reduce((total, item) => total + (item.price * item.quantity / 100), 0);
            pendingItem.innerHTML = `
                <span>${imagesHtml} ${transaction.items.length} items - Total: ₱ ${totalPrice.toFixed(2)}</span>
                <span>Expires in: <span class="timer" data-expiration="${transaction.expiration}"></span> minutes</span>
            `;
            pendingStatusContainer.appendChild(pendingItem);
        });
    }

    function addPendingItemsToAdmin(transaction) {
        console.log('Sending transaction to admin:', transaction);
    }


    // Function to handle the Pay Now button click
    function handlePayNow() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutes from now
        const transaction = {
            items: [...cart],
            expiration: expirationTime
        };
        
        pending.push(transaction);
        localStorage.setItem('pending', JSON.stringify(pending));
        addPendingItemsToAdmin(transaction);

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCounter();
        renderPendingItems();
        startTimers();
    }

    // Function to start the countdown timers for pending transactions
    function startTimers() {
        const timers = document.querySelectorAll('.timer');
        timers.forEach(timer => {
            const expiration = parseInt(timer.dataset.expiration);
            const interval = setInterval(() => {
                const remaining = Math.max(0, Math.floor((expiration - Date.now()) / 60000));
                timer.textContent = remaining;
                if (remaining === 0) {
                    clearInterval(interval);
                    pending = pending.filter(transaction => transaction.expiration !== expiration);
                    localStorage.setItem('pending', JSON.stringify(pending));
                    renderPendingItems();
                }
            }, 1000);
        });
    }

    // Event listener for the Pay Now button
    document.getElementById('pay-now').addEventListener('click', handlePayNow);

    // Event listener for the Empty Cart button
    document.getElementById('empty-cart').addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCounter();
        updateTotalPrice();
    });

     // Event listener for handling back navigation on mobile
    window.addEventListener('popstate', function(event) {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        renderCartItems();
        updateCartCounter();
        updateTotalPrice();
    });

    renderCartItems();
    renderPendingItems();
    updateCartCounter();
    startTimers();
});
