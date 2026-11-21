/* Nexus Media "Call us" voice agent (ElevenLabs).
   Limits spend per visitor: one call per browser per day. After that the
   call button is replaced by a "Message us on WhatsApp" link.
   Server-side limits live on the ElevenLabs agent itself
   (2-minute calls, 10 calls/day, 2 at once, nexusmediaph.com only). */
(function () {
  var AGENT_ID = 'agent_4001m7z74r68eh0v920zbcxr8kat';
  var WHATSAPP = 'https://wa.me/639939258293?text=' + encodeURIComponent('Hi Nexus Media, I would like a quote.');
  var KEY = 'nm_call_day';
  var CALLS_PER_DAY = 1;

  function today() { return new Date().toISOString().slice(0, 10); }
  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.d === today() ? v.n : 0; }
    catch (e) { return 0; }
  }
  function bump() {
    try { localStorage.setItem(KEY, JSON.stringify({ d: today(), n: read() + 1 })); } catch (e) {}
  }

  function showWhatsApp() {
    if (document.getElementById('nm-wa')) return;
    var a = document.createElement('a');
    a.id = 'nm-wa';
    a.href = WHATSAPP;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Message us on WhatsApp';
    a.setAttribute('style', [
      'position:fixed', 'right:16px', 'bottom:16px', 'z-index:60',
      'background:#00A3FF', 'color:#fff', 'font:600 14px/1 Inter,system-ui,sans-serif',
      'padding:14px 18px', 'border-radius:999px', 'text-decoration:none',
      'box-shadow:0 10px 30px -10px rgba(0,163,255,.7)'
    ].join(';'));
    document.body.appendChild(a);
  }

  function showCall() {
    var w = document.createElement('elevenlabs-convai');
    w.setAttribute('agent-id', AGENT_ID);
    w.setAttribute('action-text', 'Talk to us');
    w.setAttribute('start-call-text', 'Call us');
    w.setAttribute('end-call-text', 'End call');
    w.addEventListener('elevenlabs-convai:call', function () {
      bump();
      // Let the current call finish; the limit applies from the next page load.
    });
    document.body.appendChild(w);
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    s.async = true;
    document.body.appendChild(s);
  }

  function init() { if (read() >= CALLS_PER_DAY) showWhatsApp(); else showCall(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
