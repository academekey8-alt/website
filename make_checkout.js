const fs = require('fs');

let html = fs.readFileSync('checkout.html', 'utf8');

// 1. Change <title>
html = html.replace('<title>Contact AcademeKey â€” Start a Conversation</title>', '<title>Secure Checkout â€” AcademeKey</title>');
html = html.replace('<title>Contact AcademeKey — Start a Conversation</title>', '<title>Secure Checkout — AcademeKey</title>');

// 2. Change grid layout to be centered and add padding
html = html.replace('.ct-body-inner { max-width:1320px; margin:0 auto; padding:0 40px; display:grid; grid-template-columns:1fr 520px; gap:100px; align-items:start; }', '.ct-body-inner { max-width:640px; margin:0 auto; padding:0 40px; }');
html = html.replace('.ct-body { background:#fff; padding:100px 0 160px; }', '.ct-body { background:#fff; padding:160px 0 160px; }');

// 3. Remove the left panel
const leftStart = html.indexOf('<!-- LEFT -->');
const leftEnd = html.indexOf('<!-- RIGHT â€” FORM -->');
if(leftEnd === -1) {
    const leftEnd2 = html.indexOf('<!-- RIGHT — FORM -->');
    if (leftStart !== -1 && leftEnd2 !== -1) {
        html = html.substring(0, leftStart) + html.substring(leftEnd2);
    }
} else if (leftStart !== -1 && leftEnd !== -1) {
    html = html.substring(0, leftStart) + html.substring(leftEnd);
}

// 4. Remove Hero section completely
const heroStart = html.indexOf('<!-- HERO -->');
const heroEnd = html.indexOf('<!-- BODY -->');
if (heroStart !== -1 && heroEnd !== -1) {
    html = html.substring(0, heroStart) + html.substring(heroEnd);
}

// 5. Replace form block
const formStart = html.indexOf('<h3 class="ct-form-title">');
const formEnd = html.indexOf('</form>') + '</form>'.length;
if (formStart !== -1 && formEnd !== -1) {
    const newForm = `<h3 class="ct-form-title">Secure Checkout</h3>
        <p class="ct-form-subtitle">Complete your registration for AcademeKey courses.</p>

        <form id="contactForm" novalidate>
          <div class="ct-field">
            <label class="ct-label" for="ct-program">Program of interest</label>
            <div class="ct-select-wrap">
              <select class="ct-select" id="ct-program" name="program">
                <option value="" disabled selected>Select a program</option>
                <option>Leadership &amp; Management</option>
                <option>Customer Service</option>
                <option>Communication Skills</option>
                <option>Sales Training</option>
                <option>Project Management</option>
                <option>Human Resources</option>
                <option>Workplace Compliance</option>
                <option>Not sure yet â€” need a recommendation</option>
                <option>Custom / multiple programs</option>
              </select>
            </div>
          </div>
          <div class="ct-field">
            <label class="ct-label" for="ct-format">Preferred format</label>
            <div class="ct-select-wrap">
              <select class="ct-select" id="ct-format" name="format" required>
                <option value="" disabled selected>Select a format</option>
                <option>In-person / Classroom</option>
                <option>Virtual live ( Online )</option>
                <option>1 on 1 Session</option>
                <option>Onsite Training</option>
                <option>Private Corporate Training</option>
                <option>Hybrid Training</option>
                <option>Group</option>
                <option>Trial Session</option>
              </select>
            </div>
          </div>
          
          <div class="ct-field">
            <label class="ct-label" for="ct-date">Date of booking</label>
            <div class="ct-select-wrap">
              <select class="ct-select" id="ct-date" name="date" required>
                <option value="" disabled selected>Select an available date</option>
              </select>
            </div>
          </div>
          
          <div class="ct-field" id="pricing-container" style="display:none; margin-top:24px;">
            <label class="ct-label">Select Pricing Tier</label>
            <div id="pricing-options" style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
            </div>
          </div>
          <div class="ct-field">
            <label class="ct-label" for="ct-people">No. of people</label>
            <input class="ct-input" type="number" id="ct-people" name="people" min="1" placeholder="e.g. 1" required>
            <div id="offer-note" style="font-size:12px; color:rgba(11,22,41,.55); margin-top:8px;"><em>Special offer: 4+1 free (Pay for 4, get 5)</em></div>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div class="ct-field">
              <label class="ct-label" for="ct-fname">First name</label>
              <input class="ct-input" type="text" id="ct-fname" name="firstName" placeholder="Sarah" required autocomplete="given-name">
            </div>
            <div class="ct-field">
              <label class="ct-label" for="ct-lname">Last name</label>
              <input class="ct-input" type="text" id="ct-lname" name="lastName" placeholder="Johnson" required autocomplete="family-name">
            </div>
          </div>
          <div class="ct-field">
            <label class="ct-label" for="ct-email">Work email</label>
            <input class="ct-input" type="email" id="ct-email" name="email" placeholder="sarah@company.com" required autocomplete="email">
          </div>
          <button type="submit" class="ct-submit" id="ctSubmit">
            <span id="ctBtnText">Complete Registration</span>
            <svg id="ctBtnArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p class="ct-form-note">We respect your privacy. Your details are never shared with third parties.</p>
          <div id="ctError" style="display:none;margin-top:14px;padding:12px 16px;background:rgba(220,50,50,.07);border:1px solid rgba(220,50,50,.2);border-radius:10px;font-size:13px;color:#c0392b;"></div>
        </form>`;
    html = html.substring(0, formStart) + newForm + html.substring(formEnd);
}

// 6. Add Date validation and Pre-select logic to JS
const scriptEnd = html.indexOf('})();');
if (scriptEnd !== -1) {
    const extraLogic = `
  const dateSelect = document.getElementById('ct-date');
  if (dateSelect) {
      const today = new Date();
      // We want dates from today up to 3 months ahead
      const maxDate = new Date();
      maxDate.setMonth(today.getMonth() + 3);
      
      let currentMonth = today.getMonth();
      let currentYear = today.getFullYear();
      const validDates = [];
      
      for (let i = 0; i < 4; i++) { // check up to 4 months
          let year = currentYear;
          let month = currentMonth + i;
          if (month > 11) {
              month -= 12;
              year++;
          }
          
          for (let day = 1; day <= 31; day++) {
              if ((day >= 8 && day <= 14) || (day >= 22 && day <= 28)) {
                  let d = new Date(year, month, day);
                  if (d.getMonth() === month) {
                      let dayOfWeek = d.getDay();
                      if (dayOfWeek === 3 || dayOfWeek === 5) { // Wed=3, Fri=5
                          if (d >= today && d <= maxDate) {
                              validDates.push(d);
                          }
                      }
                  }
              }
          }
      }
      
      validDates.sort((a, b) => a - b);
      validDates.forEach(d => {
          let opt = document.createElement('option');
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dayNum = String(d.getDate()).padStart(2, '0');
          opt.value = \`\${y}-\${m}-\${dayNum}\`;
          opt.textContent = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
          dateSelect.appendChild(opt);
      });
  }

  const formatSelect = document.getElementById('ct-format');
  const dateSelectEl = document.getElementById('ct-date');
  const pricingContainer = document.getElementById('pricing-container');
  const pricingOptions = document.getElementById('pricing-options');

  if (formatSelect && pricingContainer && pricingOptions && dateSelectEl) {
      function updatePricingOptions() {
          const val = formatSelect.value;
          
          if (val === 'Group' || val === '1 on 1 Session' || val === 'Private Corporate Training' || val === 'Hybrid Training') {
              alert('Please contact the administrator for ' + val + ' inquiries.');
              window.location.href = 'contact.html';
              return;
          }
          
          pricingOptions.innerHTML = '';
          
          let options = [];
          
          if (val === 'Virtual live ( Online )') {
              options = [
                  { label: 'Virtual live early-bird fee $499', val: 'Virtual live early-bird fee $499', earlyBird: true },
                  { label: 'Virtual Live standard fee $549', val: 'Virtual Live standard fee $549', earlyBird: false }
              ];
          } else if (val === 'Onsite Training') {
              options = [
                  { label: 'Onsite training $699 No additional fee (Trainer travel allowance accomodation taking care of AcademeKey)', val: 'Onsite training $699', earlyBird: false }
              ];
          } else if (val === 'Trial Session') {
              options = [
                  { label: 'Trial Session for just $1', val: 'Trial Session for $1', earlyBird: false }
              ];
          } else {
              options = [
                  { label: 'Individual early-bird fee $649', val: 'Individual early-bird fee $649', earlyBird: true },
                  { label: 'Standard fee $749', val: 'Standard fee $749', earlyBird: false }
              ];
          }
          
          // Check date restriction
          const selectedDateStr = dateSelectEl.value;
          if (selectedDateStr) {
              const selectedDateObj = new Date(selectedDateStr);
              const todayObj = new Date();
              todayObj.setHours(0,0,0,0);
              const diffTime = Math.abs(selectedDateObj - todayObj);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (diffDays < 7) {
                  // Filter out early bird offers
                  options = options.filter(opt => !opt.earlyBird);
              }
          }
          
          if (options.length > 0) {
              options.forEach((opt, idx) => {
                  const div = document.createElement('div');
                  div.style.cssText = 'background: #f9f9fa; border: 1.5px solid rgba(11,22,41,.1); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: border-color 0.2s;';
                  
                  const input = document.createElement('input');
                  input.type = 'radio';
                  input.name = 'pricing';
                  input.value = opt.val;
                  input.id = 'pricing-' + idx;
                  input.style.cursor = 'pointer';
                  if (idx === 0) input.checked = true; // select first by default
                  
                  const label = document.createElement('label');
                  label.htmlFor = 'pricing-' + idx;
                  label.textContent = opt.label;
                  label.style.cssText = 'cursor: pointer; font-size: 14px; font-weight: 500; color: #0B1629; flex: 1; margin: 0;';
                  
                  div.onclick = () => { input.checked = true; };
                  
                  div.appendChild(input);
                  div.appendChild(label);
                  pricingOptions.appendChild(div);
              });
              pricingContainer.style.display = 'block';
          } else {
              pricingContainer.style.display = 'none';
          }
          
          const offerNote = document.getElementById('offer-note');
          if (offerNote) {
              if (val === 'Onsite Training') {
                  offerNote.innerHTML = '<em>Special offer: 4+1 free. Plus: Above 20 participants get up to 5 free! Above 30 get up to 10 free!</em>';
              } else {
                  offerNote.innerHTML = '<em>Special offer: 4+1 free (Pay for 4, get 5)</em>';
              }
          }
      }
      
      formatSelect.addEventListener('change', updatePricingOptions);
      dateSelectEl.addEventListener('change', updatePricingOptions);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('book');
  if (courseParam) {
    const programSelect = document.getElementById('ct-program');
    if (programSelect) {
        let found = false;
        for(let i=0; i<programSelect.options.length; i++) {
            if(programSelect.options[i].text.toLowerCase() === courseParam.toLowerCase() || programSelect.options[i].value.toLowerCase() === courseParam.toLowerCase()) {
                programSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        if(!found) {
            const newOption = document.createElement('option');
            newOption.text = courseParam;
            newOption.value = courseParam;
            programSelect.add(newOption);
            programSelect.value = courseParam;
        }
    }
  }
`;
    html = html.substring(0, scriptEnd) + extraLogic + html.substring(scriptEnd);
}

// Replace success messages to show Checkout button
const successHtml = `
        <div class="ct-success" id="ctSuccess">
          <div class="ct-success-icon" style="background:#fff7ed; color:#ea580c;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
          <h4 class="ct-success-title">Registration saved.</h4>
          <p class="ct-success-text" style="margin-bottom:24px;">Your registration details have been saved. Please click below to complete your checkout and secure your spot.</p>
          <a href="#" class="btn btn-orange" style="width:100%; display:inline-flex; justify-content:center; padding:16px;">Checkout</a>
        </div>
`;

html = html.replace(/<div class="ct-success" id="ctSuccess">[\s\S]*?<p class="ct-success-text">.*?<\/p>\s*<\/div>/, successHtml);

// Fix the button texts during submit state and error state
html = html.replace("btnText.textContent = 'Sending…';", "btnText.textContent = 'Processing...';");
html = html.replace("btnText.textContent = 'Send Message';", "btnText.textContent = 'Checkout';");

// Remove the privacy text
html = html.replace('<p class="ct-form-note">We respect your privacy. Your details are never shared with third parties.</p>', '');

// Scroll to top when success screen is shown
html = html.replace("success.style.display = 'block';", "success.style.display = 'block';\n      window.scrollTo({ top: 0, behavior: 'smooth' });");

// Replace organization, format, message in the Firebase submission logic
html = html.replace("organization: form.querySelector('#ct-org').value.trim(),", "");
html = html.replace("message:      form.querySelector('#ct-message').value.trim(),", "date:         form.querySelector('#ct-date').value,\n      people:       form.querySelector('#ct-people').value,\n      pricing:      (form.querySelector('input[name=\"pricing\"]:checked') || {}).value || '',");

// Inject the bill summary interception logic
const submitLogicStart = html.indexOf("form.addEventListener('submit', async function (e) {");
if (submitLogicStart !== -1) {
    const replacement = `
  btnText.textContent = 'Checkout';
  
  function updateBillSummary() {
      const people = parseInt(form.querySelector('#ct-people').value, 10);
      const pricing = (form.querySelector('input[name="pricing"]:checked') || {}).value || '';
      
      const existingSummary = document.getElementById('bill-summary');
      if (existingSummary) existingSummary.remove();
      
      if (isNaN(people) || people < 1 || !pricing) {
          return;
      }

      let basePrice = 0;
      let total = 0;
      let discountDesc = '';
      
      if (pricing.includes('$649')) basePrice = 649;
      else if (pricing.includes('$749')) basePrice = 749;
      else if (pricing.includes('$499')) basePrice = 499;
      else if (pricing.includes('$549')) basePrice = 549;
      else if (pricing.includes('$699')) basePrice = 699;
      
      // AUTOMATIC BUY 4 GET 1 FREE LOGIC FOR ALL FORMATS
      const freeParticipants = Math.floor(people / 5);
      const paidPeople = people - freeParticipants;
      
      if (freeParticipants > 0) {
          discountDesc = \`Buy 4 Get 1 Free offer applied (\${freeParticipants} free)!\`;
      }
      
      if (basePrice > 0) {
          total = paidPeople * basePrice;
          const originalTotal = people * basePrice;
          const discountAmount = originalTotal - total;
          
          let summaryHtml = \`
          <div id="bill-summary" style="background: #f0f4f8; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #d1d9e6;">
            <h4 style="margin-top:0; color:#0b1629; font-size:18px;">Bill Summary</h4>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span>Number of persons:</span>
              <strong>\${people}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span>Original Price (\${people} x $\${basePrice}):</span>
              <strong>$\${originalTotal}</strong>
            </div>
            \${discountDesc ? \`<div style="display:flex; justify-content:space-between; margin-bottom:8px; color: #10b981;">
              <span>Discount (\${discountDesc}):</span>
              <strong>-$\${discountAmount}</strong>
            </div>\` : ''}
            <div style="display:flex; justify-content:space-between; margin-top:16px; padding-top:16px; border-top: 1px solid #d1d9e6; font-size:18px; font-weight:bold; color: #0b1629;">
              <span>Total Bill Amount:</span>
              <span>$\${total}</span>
            </div>
          </div>
          \`;
          
          btn.parentElement.insertAdjacentHTML('beforebegin', summaryHtml);
      }
  }

  form.addEventListener('input', updateBillSummary);
  form.addEventListener('change', updateBillSummary);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errBox.style.display = 'none';
`;
    html = html.replace(/form\.addEventListener\('submit', async function \(e\) \{\s*e\.preventDefault\(\);\s*errBox\.style\.display = 'none';/, replacement);
}

// Inject PayPal SDK and custom checkout script
const paypalScripts = `
<script src="https://www.paypal.com/sdk/js?client-id=AddZ-YMIoDeMJpR4Ul9BB0IIHKP-iWLOl6rC7rRTBMlojO5hZAahPSYfyvvfcDZvmy8iY7pKsqc96SfL&currency=USD"></script>
<script type="module" src="js/checkout.js"></script>
</head>
`;
html = html.replace('</head>', paypalScripts);

fs.writeFileSync('checkout.html', html, 'utf8');

// Also update add_book.js to link to checkout.html instead of contact.html
let addBookScript = fs.readFileSync('add_book.js', 'utf8');
addBookScript = addBookScript.replace(/contact\.html\?book=/g, 'checkout.html?book=');
fs.writeFileSync('add_book.js', addBookScript, 'utf8');
