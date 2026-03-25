
const latteInput = document.getElementById("latteQty");
const macchiatoInput = document.getElementById("macchiatoQty");
const mochaInput = document.getElementById("mochaQty");
const frappeInput = document.getElementById("frappeQty");
const totalMain = document.getElementById("totalMain");

const matchaInput = document.getElementById("matchaQty");
const hibiscusInput = document.getElementById("hibiscusQty");
const chaiInput = document.getElementById("chaiQty");
const pinkInput = document.getElementById("pinkQty");
const totalTea = document.getElementById("totalTea");

const allInputs = [
    latteInput, macchiatoInput, mochaInput, frappeInput, 
    matchaInput, hibiscusInput, chaiInput, pinkInput
];

function formatMoney(amount) {
    return amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

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

function updateTotal() {
    let total = 0;

    if (totalMain) {
        let latte = 185 * (Number(latteInput.value) || 0);
        let macchiato = 210 * (Number(macchiatoInput.value) || 0);
        let mocha = 195 * (Number(mochaInput.value) || 0);
        let frappe = 225 * (Number(frappeInput.value) || 0);
        
        total = latte + macchiato + mocha + frappe;    
        totalMain.innerText = formatMoney(total); 
    }

    if (totalTea) {
        let matcha = 175 * (Number(matchaInput.value) || 0);
        let hibiscus = 165 * (Number(hibiscusInput.value) || 0);
        let chai = 180 * (Number(chaiInput.value) || 0);
        let pink = 195 * (Number(pinkInput.value) || 0);
        
        total = matcha + hibiscus + chai + pink;
        totalTea.innerText = formatMoney(total);
    }

    return total;
}

allInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', updateTotal);
    }
});

function showDiscountWindow() {
    let currentTotal = updateTotal();
    
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
        if (checkedAge < 0) {
            showToast("Age cannot be negative.", true);
            return; 
        }
        if (checkedAge > 120) {
            showToast("Please enter a valid age (Max 120).", true);
            return;
        }
    }

    let age = Number(ageInput) || 0;
    let total = updateTotal();
    let discount = 0;

    if (age >= 60) {
        discount = total * 0.12;
    }

    let finalTotal = total - discount;

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

    showToast("Payment Successful! Enjoy your drinks.");
    
    allInputs.forEach(input => {
        if (input) {
            input.value = 0;
        }
    });
    
    updateTotal(); 
    closePaymentWindow();

}
