// The opening: the sketched Nexus Media logo draws itself in the middle of the screen, turns into the
// clean logo, then shrinks and flies to the logo in the top-left of the nav while the page appears.
// Runs on every load (skipped under reduced motion: the head script never sets html.intro).
// A click or key press skips it.
(function () {
  const root = document.documentElement;
  if (!root.classList.contains('intro')) return;
  const overlay = document.getElementById('intro');
  const stage = overlay.querySelector('.intro__stage');
  const clean = overlay.querySelector('.intro__clean');
  const anims = [];
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    root.classList.remove('intro');
    overlay.remove();
  }
  const skip = () => { anims.forEach((a) => a.finish()); finish(); };
  overlay.addEventListener('click', skip);
  addEventListener('keydown', skip, { once: true });

  const anim = (el, frames, opts) => { const a = el.animate(frames, { fill: 'forwards', ...opts }); anims.push(a); return a; };
  const ease = 'cubic-bezier(.65,0,.35,1)';

  // 1. draw: rings first, then the connectors, the shaft and the arrowhead; light passes trail the heavy one
  const order = { ring: 0, line: 1, head: 2 };
  const paths = [...overlay.querySelectorAll('.sk')];
  const counters = {};
  let drawEnd = 0;
  paths.forEach((p) => {
    const kind = [...p.classList].find((c) => c.startsWith('sk-') && c !== 'sk' && !c.startsWith('sk-p')).slice(3);
    const pass = +[...p.classList].find((c) => c.startsWith('sk-p')).slice(4);
    const key = kind + pass;
    const i = (counters[key] = (counters[key] ?? -1) + 1);
    const delay = 150 + order[kind] * 520 + i * 150 + pass * 120;
    const duration = kind === 'ring' ? 520 : 300;
    drawEnd = Math.max(drawEnd, delay + duration);
    anim(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay, duration, easing: 'cubic-bezier(.4,0,.2,1)' });
  });

  // 2. the sketch settles into the clean logo
  const sketch = overlay.querySelector('svg');
  anim(sketch, [{ opacity: 1 }, { opacity: 0 }], { delay: drawEnd + 100, duration: 380 });
  anim(clean, [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'scale(1)' }], { delay: drawEnd + 100, duration: 380, easing: ease });

  // 3. fly to the nav logo (measured at that moment, so it lands right at any width)
  const flyAt = drawEnd + 100 + 380 + 260;
  setTimeout(() => {
    if (done) return;
    const target = document.querySelector('.nav .nm-logo');
    if (!target || !target.getBoundingClientRect().width) { anim(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }).onfinish = finish; return; }
    const from = stage.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const k = to.height / from.height;
    const dx = to.left - from.left, dy = to.top - from.top;
    stage.style.transformOrigin = '0 0';
    anim(stage, [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }], { duration: 820, easing: 'cubic-bezier(.7,0,.2,1)' });
    anim(clean, [{ filter: 'drop-shadow(0 0 24px rgb(0 163 255 / .45))' }, { filter: 'drop-shadow(0 0 0 rgb(0 163 255 / 0))' }], { duration: 820 });
    overlay.style.background = 'transparent';
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:0;background:var(--p-bg);z-index:-1';
    overlay.prepend(bg);
    anim(bg, [{ opacity: 1 }, { opacity: 0 }], { delay: 120, duration: 620, easing: 'ease-out' });
    setTimeout(finish, 840);
  }, flyAt);
})();
