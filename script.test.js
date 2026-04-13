const { JSDOM } = require("jsdom");
const { showInputError, clearErrors, donationData } = require("./script");

describe("Donation Tracker Tests", () => {
    let dom;
    let document;
    let charityName, donationAmount, donationDate, donorMessage;

    beforeEach(() => {
        dom = new JSDOM(`
            <form id="donationForm">
                <input id="charityName" />
                <input id="donationAmount" />
                <input id="donationDate" />
                <input id="donorMessage" />
                <div id="donation-form-messages"></div>
            </form>`);

        document = dom.window.document;
        global.document = document;

        charityName = document.getElementById("charityName");
        donationAmount = document.getElementById("donationAmount");
        donationDate = document.getElementById("donationDate");
        donorMessage = document.getElementById("donorMessage");

        donationData.length = 0;
    });

    // Unit tests
    // Test 1: Validate the empty required fields 
    test("validate that required fields identifies empty fields", () => {
        charityName.value = "";
        donationAmount.value = "";
        donationDate.value = "";
        donorMessage.value = "";

        if (!charityName.value) showInputError(charityName, "Charity name is required.");
        if (!donationAmount.value) showInputError(donationAmount, "Donation amount is required.");
        if (!donationDate.value) showInputError(donationDate, "Date of Donation is required.");
        if (!donorMessage.value) showInputError(donorMessage, "Message is required.");

        expect(document.querySelectorAll(".error-message").length).toBe(4);
        expect(document.querySelector(".error-message").innerText).toBe("Charity name is required.");

        clearErrors();
        expect(document.querySelectorAll(".error-message").length).toBe(0);
    });

    // Test 2: Validate the Donation amount
    test("validate that donation amount raises error for non-numeric and negative values", () => {
        donationAmount.value = "-50";
        if (Number(donationAmount.value) <= 0) showInputError(donationAmount, "Donation amount must be greater than zero.");
        expect(document.querySelector(".error-message").innerText).toBe("Donation amount must be greater than zero.");

        donationAmount.value = "abc"
        clearErrors()
        if (isNaN(donationAmount.value)) showInputError(donationAmount, "Donation amount must be numeric.");
        expect(document.querySelector(".error-message").innerText).toBe("Donation amount must be numeric.");
    });

    // Test 3: Validate that correct donation data has been returned to the console
    test("validate that valid donation returns correct temporary data object", () => {
        charityName.value = "Charity abc";
        donationAmount.value = "1000";
        donationDate.value = "2025-11-25";
        donorMessage.value = "Keep helping!"

        const newDonation = {
            charityName: charityName.value,
            donationAmount: Number(donationAmount.value),
            donationDate: donationDate.value,
            donorMessage: donorMessage.value
        };

        donationData.push(newDonation);
        expect(donationData[0]).toEqual(newDonation);
    });


    // Integration Tests
    // Test 1: Submitting form updates the donationData
    test("submitting form with valid data updates the temporary data object", () => {
        charityName.value = "Charity 2";
        donationAmount.value = "100";
        donationDate.value = "2025-11-25";
        donorMessage.value = "Keep it up!"

        donationData.push({
            charityName: charityName.value,
            donationAmount: Number(donationAmount.value),
            donationDate: donationDate.value,
            donorMessage: donorMessage.value
        });

        expect(donationData.length).toBe(1)
        expect(donationData[0].charityName).toBe("Charity 2");
    });

    // Test 2: submitting form with invalid data triggers validation error messages
    test("submitting form with incomplete or invalid data raises errors", () => {
        charityName.value = "";
        donationAmount.value = "20";
        donationDate.value = "";

        if (!charityName.value) showInputError(charityName, "Charity name is required.");
        if (!donationAmount.value || Number(donationAmount.value) <= 0) showInputError(donationAmount, "Donation amount must be greater than zero.")
        if (!donationDate.value) showInputError(donationDate, "Date of donation is required.");

        expect(document.querySelectorAll(".error-message").length).toBe(2)
        expect(document.querySelector(".error-message").innerText).toBe("Charity name is required.")
    })
})