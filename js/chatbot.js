/* AcademeKey — AI Chatbot (Groq API) */
(function () {
  // Using the user-provided Groq API key directly on client-side (for demo/static hosting)
  // In production with a backend, this should be proxied through a server.
  const API_KEY  = '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';
  const CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const MODEL    = 'llama-3.1-8b-instant';

  const SYSTEM = `You are the virtual assistant for AcademeKey, a premium professional training and corporate development company. You help website visitors learn about our courses and encourage them to get in touch.

Key facts:
- Name: AcademeKey
- Tagline: "The Key to Success"
- Services: Professional development courses, corporate training, leadership workshops. All courses can be customized.
- Courses offered:
  * Leadership & Management: Foundations of Leadership, Managing High-Performance Teams, Strategic Thinking for Leaders
  * Customer Service: Customer Experience Excellence, Handling Difficult Customers
  * Communication Skills: Business Communication Essentials, Presentation Skills Masterclass
  * Sales Training: Consultative Selling, Negotiation Skills for Sales Professionals
  * Project Management: Project Management Fundamentals
  * Human Resources: Effective Recruitment & Interviewing
  * Workplace Compliance: Workplace Health & Safety Essentials
  * Other: Emotional Intelligence at Work
- Contact Email: enquiry@academekey.com (placeholder)
- Contact Phone: 1-800-ACADEME (placeholder)

Guidelines:
- Be warm, professional, encouraging, and answer only what was asked — 1-2 sentences max.
- Do not invent courses that are not listed above.
- If asked about pricing or scheduling, say that our team works with you to build a custom solution and to please use the contact form to get a quote.
- Respond only in English.

Navigation rule (mandatory):
At the very end of every reply, on a new line, add exactly one tag: [NAV:X]
X must be one of: contact, programs, courses, about, none
Choose based on what page would genuinely help the user next:
- contact → user asks about enquiry, quote, pricing, getting in touch, scheduling
- programs → user asks about general program categories (leadership, sales, etc.)
- courses → user asks about specific courses or browsing all courses
- about → user asks about the company, team, or history
- none → general greeting, chitchat, or no specific page applies`;

  const PAGE_MAP = {
    contact:  { url: 'contact.html',  label: 'Contact Us' },
    programs: { url: 'programs.html', label: 'View Programs' },
    courses:  { url: 'courses.html',  label: 'Browse Courses' },
    about:    { url: 'about.html',    label: 'About Us' }
  };

  function parseNav(raw) {
    const m = raw.match(/\[NAV:(\w+)\]/i);
    const key = m ? m[1].toLowerCase() : 'none';
    const clean = raw.replace(/\[NAV:\w+\]/i, '').trim();
    return { clean: clean, link: PAGE_MAP[key] || null };
  }

  // Inject Chatbot HTML
  const widget = document.createElement('div');
  widget.id = 'akChat';
  widget.innerHTML = `
<button class="ak-bubble" id="akBubble" aria-label="Chat with us">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
</button>
<div class="ak-panel" id="akPanel" style="display:none">
  <div class="ak-head">
    <div class="ak-head-info">
      <img src="assets/img/Academekey logo.png" alt="AcademeKey" class="ak-logo" onerror="this.src='https://placehold.co/40x40?text=AK'"/>
      <div>
        <div class="ak-name">Academe Assistant</div>
        <div class="ak-status"><span class="ak-dot"></span> Online</div>
      </div>
    </div>
    <button class="ak-close" id="akClose">&times;</button>
  </div>
  <div class="ak-msgs" id="akMsgs">
    <div class="ak-msg bot">Hello! I'm the AcademeKey assistant. How can I help you find the right training program today?</div>
  </div>
  <div class="ak-input-wrap">
    <input type="text" id="akInput" placeholder="Type a message…" autocomplete="off"/>
    <button id="akSend" aria-label="Send">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
</div>`;
  document.body.appendChild(widget);

  const bubble  = document.getElementById('akBubble');
  const panel   = document.getElementById('akPanel');
  const closeBtn= document.getElementById('akClose');
  const input   = document.getElementById('akInput');
  const sendBtn = document.getElementById('akSend');
  const msgs    = document.getElementById('akMsgs');

  let history = [];

  bubble.addEventListener('click', function () {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    if (panel.style.display === 'flex') input.focus();
  });
  closeBtn.addEventListener('click', function () { panel.style.display = 'none'; });
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  function addMsg(text, role) {
    const d = document.createElement('div');
    d.className = 'ak-msg ' + role;
    if (role === 'typing') {
      d.innerHTML = '<span></span><span></span><span></span>';
    } else {
      d.textContent = text;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function addGotoBtn(parentEl, link) {
    const btn = document.createElement('a');
    btn.href = link.url;
    btn.className = 'ak-goto';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14" style="margin-right:4px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Take me to ' + link.label;
    parentEl.appendChild(btn);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendBtn.disabled = true;
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = addMsg('', 'typing');

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM }, ...history],
          max_tokens: 256,
          temperature: 0.7
        })
      });
      
      const data = await res.json();
      const raw = (data.choices && data.choices[0] && data.choices[0].message.content) || 'Sorry, I had trouble responding. Please check our contact page.';
      const parsed = parseNav(raw);
      
      typing.classList.remove('typing');
      typing.classList.add('bot');
      typing.innerHTML = '';
      typing.textContent = parsed.clean;
      
      history.push({ role: 'assistant', content: parsed.clean });

      if (parsed.link) addGotoBtn(typing, parsed.link);

    } catch (err) {
      typing.classList.remove('typing');
      typing.classList.add('bot');
      typing.innerHTML = '';
      typing.textContent = 'Connection error. Please try again or visit our Contact page.';
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }
})();
