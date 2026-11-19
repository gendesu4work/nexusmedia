// Fills every download card from the app's latest GitHub release.
// Each app section has data-repo="user/repo"; each card has data-asset (a regex for the file name,
// or "source" for GitHub's own source zip). Fields to fill carry data-f: version, date, size, count, name, href.
// If GitHub can't be reached, the buttons keep their fallback link to the releases page.

const fmtSize = (b) => b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(0) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
const fmtDate = (s) => new Date(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const fmtCount = (n) => n.toLocaleString();

function fill(scope, f, value) {
  scope.querySelectorAll(`[data-f="${f}"]`).forEach((el) => {
    if (f === 'href') { el.href = value; el.setAttribute('download', ''); }
    else el.textContent = value;
  });
}


const LOCK_SVG = '<svg class="lock-ic" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>';

// A private repo (or one with no release yet) answers 404: the app stays on the page, locked.
function lockApp(section) {
  section.classList.add('is-locked');
  section.querySelectorAll('.app-meta').forEach((m) => { fill(m, 'version', 'not public yet'); fill(m, 'date', 'soon'); });
  const h2 = section.querySelector('h2');
  if (h2 && !h2.querySelector('.lock-badge')) h2.insertAdjacentHTML('beforeend', ` <span class="lock-badge">${LOCK_SVG}Locked for now</span>`);
  section.querySelectorAll('.file').forEach((card) => {
    card.insertAdjacentHTML('afterbegin', `<span class="lock-badge lock-badge--card">${LOCK_SVG}Locked</span>`);
    ['version', 'size', 'date', 'count'].forEach((f) => fill(card, f, '—'));
    card.querySelectorAll('a.btn').forEach((a) => {
      const b = document.createElement('span');
      b.className = a.className + ' btn--locked';
      b.setAttribute('role', 'button');
      b.setAttribute('aria-disabled', 'true');
      b.innerHTML = `${LOCK_SVG}Locked for now`;
      a.replaceWith(b);
    });
  });
}

function branchApp(section, repo, info) {
  const branch = info.default_branch || 'main';
  const date = fmtDate(info.pushed_at);
  section.querySelectorAll('.app-meta').forEach((m) => { fill(m, 'version', branch + ' branch'); fill(m, 'date', date); });
  section.querySelectorAll('.file[data-asset]').forEach((card) => {
    if (card.dataset.asset !== 'source') return;
    fill(card, 'version', branch);
    fill(card, 'date', date);
    fill(card, 'size', info.size ? fmtSize(info.size * 1024) : 'small');
    fill(card, 'name', `${repo.split('/')[1]}-${branch}.zip`);
    fill(card, 'href', `https://github.com/${repo}/archive/refs/heads/${encodeURIComponent(branch)}.zip`);
  });
}

// Always ask GitHub fresh (no page cache, no browser cache), so a release published a minute ago is
// what the button downloads.
const gh = (path) => fetch(`https://api.github.com/repos/${path}`, { cache: 'no-store', headers: { Accept: 'application/vnd.github+json' } });
const when = (r) => new Date(r.published_at || r.created_at).getTime();

async function loadApp(section) {
  const repo = section.dataset.repo;
  if (!repo || repo.startsWith('your-github/')) return;
  const res = await gh(`${repo}/releases?per_page=20`);
  if (res.status === 404) { lockApp(section); return; } // private repo
  if (!res.ok) return; // GitHub busy or rate-limited: buttons keep their link to GitHub's own latest-release page
  // the newest published release by date (drafts and pre-releases are not downloads yet)
  const rel = (await res.json()).filter((r) => !r.draft && !r.prerelease).sort((a, b) => when(b) - when(a))[0];
  if (!rel) {
    // no release: a public repo still offers its source from the default branch
    const repoRes = await gh(repo);
    if (repoRes.ok) branchApp(section, repo, await repoRes.json());
    return;
  }
  section.dataset.loaded = Date.now();
  const version = rel.tag_name || rel.name;
  const date = fmtDate(rel.published_at);
  section.querySelectorAll('.app-meta').forEach((m) => { fill(m, 'version', version); fill(m, 'date', date); });

  section.querySelectorAll('.file[data-asset]').forEach((card) => {
    fill(card, 'version', version);
    fill(card, 'date', date);
    if (card.dataset.asset === 'source') {
      fill(card, 'href', `https://github.com/${repo}/archive/refs/tags/${encodeURIComponent(rel.tag_name)}.zip`);
      fill(card, 'name', `${repo.split('/')[1]}-${rel.tag_name}.zip`);
      return;
    }
    const re = new RegExp(card.dataset.asset, 'i');
    const asset = (rel.assets || []).find((a) => re.test(a.name));
    if (!asset) {
      // the newest release has no matching file yet (still uploading): send people to that release, never an older one
      fill(card, 'href', rel.html_url);
      ['size', 'count'].forEach((f) => fill(card, f, 'uploading'));
      return;
    }
    fill(card, 'href', asset.browser_download_url);
    fill(card, 'name', asset.name);
    fill(card, 'size', fmtSize(asset.size));
    fill(card, 'count', fmtCount(asset.download_count));
  });
}

const loadAll = () => document.querySelectorAll('[data-repo]').forEach((s) => loadApp(s).catch(() => {}));
loadAll();
// a tab left open: check again when the visitor comes back to it after two minutes or more
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const s = document.querySelector('[data-repo][data-loaded]');
  if (s && Date.now() - +s.dataset.loaded > 12e4) loadAll();
});
