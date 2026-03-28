// Master list of all items across the entire website
const menuItems = {
    // Coffees
    'latteQty': { name: 'Caffè Latte', price: 185 },
    'macchiatoQty': { name: 'Caramel Macchiato', price: 210 },
    'mochaQty': { name: 'White Chocolate Mocha', price: 195 },
    'frappeQty': { name: 'Java Chip Frappuccino®', price: 225 },
    
    // Teas
    'matchaQty': { name: 'Matcha Tea Latte', price: 175 },
    'hibiscusQty': { name: 'Iced Hibiscus Tea', price: 165 },
    'chaiQty': { name: 'Chai Tea Latte', price: 180 },
    'pinkQty': { name: 'Pink Drink', price: 195 },

    // Pastries
    'qty-croissant': { name: 'Chocolate Croissant', price: 120 },
    'qty-muffin': { name: 'Blueberry Muffin', price: 105 },
    'qty-doughnut': { name: 'Glazed Doughnut', price: 85 }
};

function formatMoney(amount) {
    return amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Function to update the cart on the right side
function updateCart() {
    let total = 0;
    const cartItemsContainer = document.getElementById('cart-items');
    const totalMain = document.getElementById("totalMain");
    
    cartItemsContainer.innerHTML = ''; 
    let hasItems = false;

    // Look for all number inputs on the page
    const currentInputs = document.querySelectorAll('input[type="number"]');

    currentInputs.forEach(input => {
        const qty = Number(input.value) || 0;
        const itemId = input.id;
        
        // Ensure we don't calculate the customer's age as an item!
        if (itemId !== 'customerAge' && qty > 0 && menuItems[itemId]) {
            hasItems = true;
            const itemData = menuItems[itemId];
            const itemTotal = qty * itemData.price;
            total += itemTotal;

            // Add the item to the cart HTML
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <span>${qty}x ${itemData.name}</span>
                    <span style="color: #007042; font-weight: bold;">₱${formatMoney(itemTotal)}</span>
                </div>
            `;
        }
    });

    if (!hasItems) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    }

    if (totalMain) {
        totalMain.innerText = formatMoney(total); 
    }

    return total; 
}

// Listen for typing or clicking arrows on the number boxes
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        if (input.id !== 'customerAge') {
            input.addEventListener('input', updateCart);
        }
    });
});

// --- POPUP, DISCOUNT, AND PAYMENT LOGIC ---

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    
    if (isError) {
        toast.classList.add("error");
    } else {
        toast.classList.remove("error");
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showDiscountWindow() {
    let currentTotal = updateCart();
    
    // Don't let them order if the cart is empty
    if (currentTotal === 0) {
        showToast("Please add at least one item to your order.", true);
        return;
    }

    document.getElementById("customerAge").value = "";
    document.getElementById("discountModal").style.display = "flex";
}

function closeDiscountWindow() {
    document.getElementById("discountModal").style.display = "none";
}

function proceedToPayment() {
    let ageInput = document.getElementById("customerAge").value;

    if (ageInput !== "") {
        let checkedAge = Number(ageInput);
        if (checkedAge <= 0) { 
            showToast("Please enter a valid age greater than 0.", true);
            return; 
        }
        if (checkedAge > 120) {
            showToast("Please enter a valid age.", true);
            return;
        }
    }

    let age = Number(ageInput) || 0;
    let total = updateCart();
    let discount = 0;

    // Apply 12% discount if age is 60 or older
    if (age >= 60) {
        discount = total * 0.12;
    }

    let finalTotal = total - discount;

    // Fill the receipt in the payment modal
    document.getElementById("originalTotal").innerText = formatMoney(total);
    document.getElementById("discountAmount").innerText = formatMoney(discount);
    document.getElementById("finalTotal").innerText = formatMoney(finalTotal);

    closeDiscountWindow();
    document.getElementById("paymentModal").style.display = "flex";
}

function closePaymentWindow() {
    document.getElementById("paymentModal").style.display = "none";
}

function processPayment() {
    showToast("Payment Successful! Enjoy your order.");
    
    // Clear all inputs back to 0 after successful payment
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        if (input.id !== 'customerAge') {
            input.value = 0;
        }
    });
    
    updateCart(); 
    closePaymentWindow();
}

