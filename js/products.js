import { cart, addToCart, updateCartUI,} from "./cartData.js";
import { products } from "./productData.js";

const productList = document.querySelector('.js-product-list');
productList.innerHTML = '';

// daynamic loader of all products
products.forEach(product => {
    const productItem = `
                <div class="product-item">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="details">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="price">₱ ${(product.price / 100).toFixed(2)}</p>
                        <div class="product-actions">
                            <button class="add-to-cart-btn js-add-to-cart-btn" 
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-description="${product.description}"
                            data-product-price="${(product.price / 100).toFixed(2)}"
                            data-product-category="${product.category}"
                            data-product-image="${product.image}"
                            >Add to Cart</button>
                        </div>
                    </div>
                </div>`;

                productList.innerHTML += productItem;

});

// Attach event listeners to all "Add to Cart" buttons
document.addEventListener('click', function(event) {
    // Check if the clicked element is an "Add to Cart" button
    if (event.target.classList.contains('js-add-to-cart-btn')) {
        // Extract product details from data attributes
        const productId = event.target.getAttribute('data-product-id');
        const productName = event.target.getAttribute('data-product-name');
        const productDescription = event.target.getAttribute('data-product-description');
        const productPrice = parseFloat(event.target.getAttribute('data-product-price'));
        const productCategory = event.target.getAttribute('data-product-category');
        const productImage = event.target.getAttribute('data-product-image');

        // Create a product object with the extracted data
        const product = {
            id: productId,
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory,
            image: productImage
        };

        // Call the addToCart function to add this product to the cart
        addToCart(product);
        updateCartUI();
    }
});

    updateCartUI();




