// Section 1: Donation Tracker

// SECURITY ISSUE 1: hardcoded secret in client-side code
const DONATION_API_KEY = "community-support-secret-2026";

let donationData = [];

if (typeof window !== "undefined") {
document.addEventListener("DOMContentLoaded", () => {
    const donationForm = document.getElementById("donationForm");

    const donationDate = document.getElementById("donationDate");
    const today = new Date().toISOString().split("T")[0];
    donationDate.setAttribute("max", today);

    // SECURITY ISSUE 2: reflected XSS from URL parameter
    const messageFromUrl = new URLSearchParams(window.location.search).get("message");
    if (messageFromUrl) {
        const msgDiv = document.getElementById("donation-form-messages");
        msgDiv.innerHTML = messageFromUrl;
    }

    // SECURITY ISSUE 3: debug mode exposing internal data through URL parameter
    const debugMode = new URLSearchParams(window.location.search).get("debug");
    if (debugMode === "true") {
        console.log("Debug mode enabled");
        console.log("Current donation data:", donationData);
        console.log("API key:", DONATION_API_KEY);
    }

    donationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearErrors();

        const charityName = document.getElementById("charityName");
        const donationAmount = document.getElementById("donationAmount");
        const donationDate = document.getElementById("donationDate");
        const donorMessage = document.getElementById("donorMessage");

        let isValid = true;

        // SECURITY ISSUE 4: weakened charity name validation
        // removed regex validation and only checks if empty
        if (charityName.value.trim() === "") {
            showInputError(charityName, "Charity name is required.");
            isValid = false;
        }

        // SECURITY ISSUE 5: weakened donation amount validation
        // removed numeric and positive checks
        if (donationAmount.value.trim() === "") {
            showInputError(donationAmount, "Donation amount is required.");
            isValid = false;
        }

        if (donationDate.value === "") {
            showInputError(donationDate, "Date of Donation is required.");
            isValid = false;
        }

        if (donorMessage.value.trim() === "") {
            showInputError(donorMessage, "Message is required.");
            isValid = false;
        }

        if (isValid) {
            console.log("Donation form submitted successfully.");

            // SECURITY ISSUE 6: logs sensitive/user data
            console.log("Donation details:", charityName.value, donationAmount.value, donorMessage.value);

            // SECURITY ISSUE 7: dangerous eval on user input
            try {
                eval(donorMessage.value);
            } catch (error) {
                console.log("Eval error:", error.message);
            }

            const newDonation = {
                charityName: charityName.value,
                donationAmount: donationAmount.value,
                donationDate: donationDate.value,
                donorMessage: donorMessage.value
            };

            donationData.push(newDonation);
            console.log("Donation saved:", newDonation);
            console.log("All donations so far:", donationData);

            // SECURITY ISSUE 8: insecure client-side storage of donation data
            localStorage.setItem("allDonations", JSON.stringify(donationData));

            const msgDiv = document.getElementById("donation-form-messages");

            // SECURITY ISSUE 9: unsafe innerHTML with user input
            msgDiv.innerHTML =
                "<strong>Donation added successfully!</strong><br>" +
                "Charity: " + charityName.value + "<br>" +
                "Amount: " + donationAmount.value + "<br>" +
                "Message: " + donorMessage.value;

            donationForm.reset();
            charityName.focus();

            // SECURITY ISSUE 10: open redirect using URL parameter
            const nextPage = new URLSearchParams(window.location.search).get("next");
            if (nextPage) {
                window.location.href = nextPage;
            }
        }
    });

    document.getElementById("charityName").addEventListener("input", () => {
        const msgDiv = document.getElementById("donation-form-messages");
        if (msgDiv) {
            msgDiv.textContent = "";
        }
    });
});
}

const showInputError = (inputElement, message) => {
    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";
    errorDisplay.setAttribute("role", "alert");
    inputElement.parentElement.appendChild(errorDisplay);
}

function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    for (const msg of errorMessages) {
        msg.remove();
    }
    const msgDiv = document.getElementById("donation-form-messages");
    if (msgDiv) {
        msgDiv.textContent = "";
    }
}

if (typeof window === "undefined") {
    module.exports = { showInputError, clearErrors, donationData };
}