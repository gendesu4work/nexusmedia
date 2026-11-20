// Visit counter for nexusmediaph.com. Load with:
//   <script src="/track.js" data-site="home|calculator|blueprints" defer></script>
// Logs one row per page load to Supabase (see supabase/visits-schema.sql).
// Only counts on nexusmediaph.com, so local testing doesn't add fake visits
// (add ?track-test to the URL to count a local page load on purpose).
(function () {
  try {
    var el = document.currentScript;
    var site = el && el.getAttribute('data-site');
    var host = location.hostname;
    if (!site || navigator.webdriver) return;
    if (!/(^|\.)nexusmediaph\.com$/.test(host) && !/[?&]track-test\b/.test(location.search)) return;

    var visitor = null;
    try {
      visitor = localStorage.getItem('nx_vid');
      if (!visitor) {
        visitor = window.crypto && crypto.randomUUID ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('nx_vid', visitor);
      }
    } catch (e) { visitor = null; }

    var ref = null;
    try {
      if (document.referrer) {
        var r = new URL(document.referrer);
        // A reload of the same page isn't a source.
        if (!(r.hostname === host && r.pathname === location.pathname)) ref = r.origin + r.pathname;
      }
    } catch (e) { ref = null; }

    fetch('https://oytgbzaukedyfifavvlq.supabase.co/rest/v1/rpc/log_visit', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_Anms_YAih0GhtNJ3fVYEnA_wMsv8TA9' },
      body: JSON.stringify({ p_site: site, p_path: location.pathname, p_visitor: visitor, p_referrer: ref })
    }).catch(function () {});
  } catch (e) {}
})();
