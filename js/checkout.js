import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('ctSuccess');
    const errBox = document.getElementById('ctError');
    const submitBtn = document.getElementById('ctSubmit');
    
    // Hide the default submit button as we will use PayPal buttons
    if (submitBtn) {
        submitBtn.style.display = 'none';
        
        // Add PayPal container before the submit button
        const paypalContainer = document.createElement('div');
        paypalContainer.id = 'paypal-button-container';
        paypalContainer.style.marginTop = '24px';
        submitBtn.parentElement.insertBefore(paypalContainer, submitBtn);
    }
    
    if (window.paypal) {
        paypal.Buttons({
            onInit: function(data, actions) {
                // Optional: disable button until form is valid
            },
            onClick: function(data, actions) {
                // Validate form before starting PayPal popup
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return actions.reject();
                }
                
                // Calculate total to ensure it's not 0
                const people = parseInt(form.querySelector('#ct-people').value, 10);
                const pricing = (form.querySelector('input[name="pricing"]:checked') || {}).value || '';
                if (isNaN(people) || people < 1 || !pricing) {
                    errBox.textContent = 'Please select a valid pricing tier and number of participants.';
                    errBox.style.display = 'block';
                    return actions.reject();
                }
                
                errBox.style.display = 'none';
                return actions.resolve();
            },
            createOrder: function(data, actions) {
                // Calculate total from the form
                const people = parseInt(form.querySelector('#ct-people').value, 10);
                const pricing = form.querySelector('input[name="pricing"]:checked').value;
                let basePrice = 0;
                
                if (pricing.includes('$649')) basePrice = 649;
                else if (pricing.includes('$749')) basePrice = 749;
                else if (pricing.includes('$499')) basePrice = 499;
                else if (pricing.includes('$549')) basePrice = 549;
                else if (pricing.includes('$699')) basePrice = 699;
                
                const freeParticipants = Math.floor(people / 5);
                const paidPeople = people - freeParticipants;
                const total = paidPeople * basePrice;
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toString()
                        },
                        description: `AcademeKey Course Registration - ${people} participant(s)`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(async function(details) {
                    // Payment successful!
                    const paymentData = {
                        firstName: form.querySelector('#ct-fname').value.trim(),
                        lastName: form.querySelector('#ct-lname').value.trim(),
                        email: form.querySelector('#ct-email').value.trim(),
                        organization: form.querySelector('#ct-org') ? form.querySelector('#ct-org').value.trim() : '',
                        program: form.querySelector('#ct-program') ? form.querySelector('#ct-program').value : '',
                        format: form.querySelector('#ct-format') ? form.querySelector('#ct-format').value : '',
                        date: form.querySelector('#ct-date') ? form.querySelector('#ct-date').value : '',
                        people: form.querySelector('#ct-people') ? form.querySelector('#ct-people').value : '1',
                        paypalOrderId: details.id,
                        payerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
                        payerEmail: details.payer.email_address,
                        amount: details.purchase_units[0].amount.value,
                        currency: details.purchase_units[0].amount.currency_code,
                        status: details.status,
                        timestamp: serverTimestamp()
                    };
                    
                    try {
                        await addDoc(collection(db, 'payments'), paymentData);
                        // Show success screen
                        form.style.display = 'none';
                        if (success) success.style.display = 'block';
                    } catch (err) {
                        console.error('Error saving payment to Firestore:', err);
                        errBox.textContent = 'Payment successful, but we had trouble saving your record. Please contact us.';
                        errBox.style.display = 'block';
                    }
                });
            },
            onError: function (err) {
                console.error('PayPal Checkout onError', err);
                errBox.textContent = 'An error occurred during the payment process. Please try again.';
                errBox.style.display = 'block';
            }
        }).render('#paypal-button-container');
    }
});
