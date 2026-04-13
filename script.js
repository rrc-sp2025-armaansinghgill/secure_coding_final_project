// Section 1: Donation Tracker
let donationData = [];

if (typeof window!== "undefined") {
document.addEventListener("DOMContentLoaded", () => {
    const donationForm = document.getElementById("donationForm");

    const donationDate = document.getElementById("donationDate");
    const today = new Date().toISOString().split("T") [0];
    donationDate.setAttribute("max", today);

    donationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearErrors();

        const charityName = document.getElementById("charityName");
        const donationAmount = document.getElementById("donationAmount");
        const donationDate = document.getElementById("donationDate");
        const donorMessage = document.getElementById("donorMessage");

        let isValid = true;

        const namePattern = /^[a-zA-Z\s]+$/;
        if (charityName.value.trim() === "") {
            showInputError(charityName, "Charity name is required.");
            isValid = false;
        } else if (!namePattern.test(charityName.value.trim())) {
            showInputError(charityName, "Charity name must contain only letters and spaces.");
            isValid = false;
        }

        if (donationAmount.value.trim() === "") {
            showInputError(donationAmount, "Donation amount is required.")
            isValid = false;
        } else if (isNaN(donationAmount.value.trim())) {
            showInputError(donationAmount, "Donation amount must be numeric.")
            isValid = false;
        } else if (Number(donationAmount.value.trim()) <= 0) {
            showInputError(donationAmount, "Donation amount must be greater than zero.")
            isValid = false;
        }

        if (donationDate.value === "") {
            showInputError(donationDate, "Date of Donation is required.")
            isValid = false;
        }

        if (donorMessage.value.trim() === "") {
            showInputError(donorMessage, "Message is required.")
            isValid = false;
        }

        if (isValid) {
            console.log("Donation form submitted successfully.")

            const newDonation = {
                charityName: charityName.value.trim(),
                donationAmount: Number(donationAmount.value.trim()),
                donationDate: donationDate.value,
                donorMessage: donorMessage.value.trim()
            };

            donationData.push(newDonation);
            console.log("Donation saved:", newDonation);
            console.log("All donations so far:", donationData);

            const msgDiv = document.getElementById("donation-form-messages");
            msgDiv.textContent = "Donation added successfully!";

            donationForm.reset();
            charityName.focus();
        }   
    });

    document.getElementById("charityName").addEventListener("input", () => {
        const msgDiv = document.getElementById("donation-form-messages");
        if (msgDiv) {
            msgDiv.textContent = "";
        }
    })
});
}

const showInputError = (inputElement, message) => {
    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";
    errorDisplay.setAttribute("role", "alert")
    inputElement.parentElement.appendChild(errorDisplay);
}

function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    for (const msg of errorMessages) {
        msg.remove();
    }
    const msgDiv = document.getElementById("donation-form-messages")
    if (msgDiv) {
        msgDiv.textContent = "";
    }
}

if (typeof window === "undefined") {
    module.exports = {showInputError, clearErrors, donationData}
}