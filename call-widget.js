/* Nexus Media "Call our AI assistant" — inline voice call button (ElevenLabs).
   Renders only inside elements marked data-nm-call (the contact sections), never as a pop-up.
   Abuse limits:
   - one call per browser per day (after that: WhatsApp link)
   - on the ElevenLabs agent: 2-minute calls, 10 calls/day, 2 at once, nexusmediaph.com only */
(function () {
  var AGENT_ID = 'agent_4001m7z74r68eh0v920zbcxr8kat';
  var SDK = 'https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.34.0/+esm';
  var WHATSAPP = 'https://wa.me/639939258293?text=' + encodeURIComponent('Hi Nexus Media, I would like a quote.');
  var KEY = 'nm_call_day_v2';
  var CALLS_PER_DAY = 1;

  function today() { return new Date().toISOString().slice(0, 10); }
  function used() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.d === today() ? v.n : 0; }
    catch (e) { return 0; }
  }
  function bump() {
    try { localStorage.setItem(KEY, JSON.stringify({ d: today(), n: used() + 1 })); } catch (e) {}
  }

  var css = '.nm-call{margin-top:22px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}' +
    '.nm-call.center{align-items:center;text-align:center}' +
    '.nm-call-label{font-size:.9rem;opacity:.8}' +
    '.nm-call button,.nm-call a.nm-wa{display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;' +
    'font:600 .92rem/1 Inter,system-ui,sans-serif;cursor:pointer;border:1.5px solid currentColor;background:transparent;color:inherit;text-decoration:none;transition:transform .2s}' +
    '.nm-call button:hover,.nm-call a.nm-wa:hover{transform:translateY(-2px)}' +
    '.nm-call button[disabled]{opacity:.6;cursor:default;transform:none}' +
    '.nm-call button.live{background:#E5484D;border-color:#E5484D;color:#fff}' +
    '.nm-call .dot{width:8px;height:8px;border-radius:50%;background:#00A3FF}' +
    '.nm-call button.live .dot{background:#fff;animation:nmpulse 1s infinite}' +
    '@keyframes nmpulse{50%{opacity:.3}}' +
    '.nm-call small{font-size:.78rem;opacity:.65;max-width:360px}';

  function whatsappLink(box, text) {
    box.innerHTML = '';
    var a = document.createElement('a');
    a.className = 'nm-wa'; a.href = WHATSAPP; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = text || 'Message us on WhatsApp';
    box.appendChild(a);
  }

  function render(box) {
    box.classList.add('nm-call');
    if (used() >= CALLS_PER_DAY) {
      whatsappLink(box, 'Message us on WhatsApp');
      return;
    }
    box.innerHTML = '<span class="nm-call-label">Prefer to talk?</span>' +
      '<button type="button"><span class="dot"></span><span class="t">Call our AI assistant</span></button>' +
      '<small>Free voice call in your browser, up to 2 minutes, answered by our AI assistant. ' +
      'Calls are recorded so our team can prepare your quote.</small>';
    var btn = box.querySelector('button'), label = box.querySelector('.t');
    var convo = null, state = 'idle';

    function set(s, text) { state = s; label.textContent = text; btn.classList.toggle('live', s === 'live'); btn.disabled = s === 'connecting'; }
    function done(msg) {
      convo = null;
      box.querySelector('small').textContent = msg;
      var a = document.createElement('a');
      a.className = 'nm-wa'; a.href = WHATSAPP; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Continue on WhatsApp';
      box.replaceChild(a, btn);
    }

    btn.addEventListener('click', function () {
      if (state === 'live' && convo) { convo.endSession(); return; }
      if (state !== 'idle') return;
      set('connecting', 'Connecting…');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        stream.getTracks().forEach(function (t) { t.stop(); });
        return import(SDK);
      }).then(function (mod) {
        return mod.Conversation.startSession({
          agentId: AGENT_ID,
          onConnect: function () { bump(); set('live', 'On call · tap to end'); },
          onDisconnect: function () { done('Call ended. Thanks! Message us on WhatsApp for anything else; our team replies within 24 hours.'); },
          onError: function () {}
        });
      }).then(function (c) { convo = c; })
        .catch(function () {
          set('idle', 'Call our AI assistant');
          box.querySelector('small').textContent = 'Could not start the call (microphone blocked or line busy). Please message us on WhatsApp instead.';
        });
    });
  }

  function init() {
    var boxes = document.querySelectorAll('[data-nm-call]');
    if (!boxes.length) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    for (var i = 0; i < boxes.length; i++) render(boxes[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
