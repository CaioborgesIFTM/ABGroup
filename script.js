'use strict';

// All content remains in the document and works with native details without JS.
document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 821px)');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu(returnFocus = false) {
  navigation?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = 'Menu';
  if (returnFocus) toggle?.focus();
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Fechar' : 'Menu';
  navigation?.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});

function enterContent(element) {
  if (!element || reducedMotion.matches) return;
  element.animate([
    { opacity: 0.25, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 320, easing: 'cubic-bezier(.2,.75,.25,1)' });
}
function fragmentId() {
  try { return decodeURIComponent(location.hash.slice(1)); }
  catch { return ''; }
}

// Desktop uses one service panel; mobile keeps the same content as an accordion.
const solutionWorkspace = document.querySelector('.solutions-workspace');
const solutionTabList = solutionWorkspace?.querySelector('.solution-tabs');
const solutionTabs = [...document.querySelectorAll('.solution-tab[data-service]')];
const solutions = [...document.querySelectorAll('.solution-panels > details.solution')];
const solutionById = new Map(solutions.map(solution => [solution.id, solution]));
const tabById = new Map(solutionTabs.map(tab => [tab.dataset.service, tab]));
let selectedSolution = solutionById.has(fragmentId()) ? fragmentId() : solutions[0]?.id;
let lastSolutionControl = null;
document.addEventListener('focusin', event => {
  lastSolutionControl = event.target.closest('.solution-tab, .solution-summary');
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.solution-tab, .solution-summary')) lastSolutionControl = null;
});

function selectSolution(id, { animate = true, focus = false } = {}) {
  if (!solutionById.has(id)) return false;
  const changed = selectedSolution !== id || !solutionById.get(id).open;
  selectedSolution = id;
  solutions.forEach(solution => {
    const selected = solution.id === id;
    solution.hidden = desktop.matches && !selected;
    solution.open = selected;
  });
  solutionTabs.forEach(tab => {
    const selected = tab.dataset.service === id;
    tab.classList.toggle('is-active', selected);
    if (desktop.matches) {
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
  });
  const active = solutionById.get(id);
  if (animate && changed) enterContent(active.querySelector('.solution-body'));
  if (focus) {
    const focusTarget = desktop.matches ? active.querySelector('.solution-body') : active.querySelector('summary');
    focusTarget?.focus({ preventScroll: true });
  }
  return true;
}

function configureSolutions() {
  if (!solutions.length) return;
  // CSS may hide the former control before the media-query event reaches JS.
  const focused = document.activeElement === document.body ? lastSolutionControl : document.activeElement;
  const focusedTab = focused?.closest('.solution-tab');
  const focusedSummary = focused?.closest('.solution-summary');
  if (desktop.matches) {
    solutionTabList?.setAttribute('role', 'tablist');
    solutionTabList?.setAttribute('aria-orientation', 'vertical');
    if (solutionTabList && !solutionTabList.hasAttribute('aria-label')) solutionTabList.setAttribute('aria-label', 'Áreas de consultoria');
  } else {
    solutionTabList?.removeAttribute('role');
    solutionTabList?.removeAttribute('aria-orientation');
  }
  solutionTabs.forEach(tab => {
    tab.setAttribute('aria-controls', `panel-${tab.dataset.service}`);
    if (desktop.matches) tab.setAttribute('role', 'tab');
    else {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
    }
  });
  solutions.forEach(solution => {
    if (desktop.matches) solution.removeAttribute('name');
    else solution.setAttribute('name', 'abgroup-solutions');
    const body = solution.querySelector('.solution-body');
    if (!body) return;
    if (desktop.matches) {
      body.setAttribute('role', 'tabpanel');
      body.setAttribute('aria-labelledby', `tab-${solution.id}`);
      body.tabIndex = 0;
    } else {
      body.removeAttribute('role');
      body.removeAttribute('aria-labelledby');
      body.removeAttribute('tabindex');
    }
  });
  selectSolution(selectedSolution, { animate: false });
  // A breakpoint must not leave keyboard focus inside a hidden control.
  if (!desktop.matches && focusedTab) solutionById.get(selectedSolution)?.querySelector('summary')?.focus({ preventScroll: true });
  else if (desktop.matches && focusedSummary) tabById.get(selectedSolution)?.focus({ preventScroll: true });
}

solutionTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectSolution(tab.dataset.service));
  tab.addEventListener('keydown', event => {
    if (!desktop.matches) return;
    let nextIndex;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % solutionTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + solutionTabs.length) % solutionTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = solutionTabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const next = solutionTabs[nextIndex];
    selectSolution(next.dataset.service);
    next.focus({ preventScroll: true });
  });
});
solutions.forEach(solution => solution.addEventListener('toggle', () => {
  if (!desktop.matches && solution.open) selectSolution(solution.id);
}));
configureSolutions();
desktop.addEventListener('change', () => { closeMenu(); configureSolutions(); });

function scrollToService(id, { smooth = true, focus = false } = {}) {
  if (!selectSolution(id, { animate: false, focus })) return;
  solutionById.get(id).scrollIntoView({ behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant', block: 'start' });
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const id = link.getAttribute('href').slice(1);
  if (!solutionById.has(id)) return;
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    scrollToService(id, { focus: true });
  });
});

// Segment controls stay in place. Their companies share a separate display area.
const clientSection = document.getElementById('clientes');
const segmentControls = [...document.querySelectorAll('.segment-controls .segment[data-segment]')];
const clientStage = document.querySelector('.client-stage');
const clientPanels = [...document.querySelectorAll('.client-panel')];
const clientPanelById = new Map(clientPanels.map(panel => [panel.id, panel]));
const clientClose = document.getElementById('clients-close');
const pauseControl = document.getElementById('clients-pause');
let selectedSegment = null;
let rotationPaused = reducedMotion.matches;
let clientsVisible = false;
let rotationTimer;
const positions = new Map(segmentControls.map(control => [control, 0]));

function closeClients({ returnFocus = false } = {}) {
  const previous = segmentControls.find(control => control.dataset.segment === selectedSegment);
  selectedSegment = null;
  segmentControls.forEach(control => {
    control.setAttribute('aria-expanded', 'false');
    control.classList.remove('is-selected');
  });
  clientPanels.forEach(panel => { panel.hidden = true; });
  if (clientStage) clientStage.hidden = true;
  if (returnFocus) previous?.focus();
}
function selectSegment(id, { animate = true, reveal = false } = {}) {
  if (!clientPanelById.has(id) || !clientStage) return false;
  selectedSegment = id;
  segmentControls.forEach(control => {
    const selected = control.dataset.segment === id;
    control.setAttribute('aria-expanded', String(selected));
    control.classList.toggle('is-selected', selected);
  });
  clientPanels.forEach(panel => { panel.hidden = panel.id !== id; });
  clientStage.hidden = false;
  if (animate) enterContent(clientPanelById.get(id));
  if (reveal) {
    clientPanelById.get(id).querySelector('h3')?.focus({ preventScroll: true });
    const bounds = clientStage.getBoundingClientRect();
    const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom || 0;
    if (bounds.top < headerBottom + 12 || bounds.bottom > innerHeight) {
      clientStage.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
    }
  }
  return true;
}
clientPanels.forEach(panel => {
  const heading = panel.querySelector('h3');
  if (heading && !heading.id) heading.id = `title-${panel.id}`;
  if (heading) {
    heading.tabIndex = -1;
    panel.setAttribute('aria-labelledby', heading.id);
  }
});
segmentControls.forEach(control => {
  control.setAttribute('aria-controls', control.dataset.segment);
  control.setAttribute('aria-expanded', 'false');
  control.addEventListener('click', () => {
    if (selectedSegment === control.dataset.segment) closeClients();
    else selectSegment(control.dataset.segment, { reveal: true });
  });
});
clientClose?.addEventListener('click', () => closeClients({ returnFocus: true }));
clientSection?.addEventListener('keydown', event => {
  if (event.key === 'Escape' && selectedSegment) {
    event.preventDefault();
    closeClients({ returnFocus: true });
  }
});
closeClients();
if (clientPanelById.has(fragmentId())) selectSegment(fragmentId(), { animate: false });

function nextLogos() {
  segmentControls.forEach(control => {
    const id = control.dataset.segment;
    if (id === selectedSegment) return;
    const logos = [...(clientPanelById.get(id)?.querySelectorAll('.client-grid img') || [])];
    const preview = control.querySelector('.segment-logo');
    if (!logos.length || !preview) return;
    const position = (positions.get(control) + 1) % logos.length;
    positions.set(control, position);
    preview.src = logos[position].getAttribute('src');
    preview.alt = logos[position].alt;
    if (!reducedMotion.matches) preview.animate([
      { opacity: 0.25, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 380, easing: 'ease-out' });
  });
}
function syncRotation() {
  clearInterval(rotationTimer);
  if (pauseControl) {
    pauseControl.textContent = rotationPaused ? 'Retomar alternância' : 'Pausar alternância';
    pauseControl.setAttribute('aria-pressed', String(rotationPaused));
  }
  if (!rotationPaused && clientsVisible && !document.hidden) rotationTimer = setInterval(nextLogos, 5000);
}
pauseControl?.addEventListener('click', () => { rotationPaused = !rotationPaused; syncRotation(); });
document.addEventListener('visibilitychange', syncRotation);
reducedMotion.addEventListener('change', event => { rotationPaused = event.matches; syncRotation(); });
if (clientSection) new IntersectionObserver(entries => {
  clientsVisible = entries[0].isIntersecting;
  syncRotation();
}, { threshold: 0.05 }).observe(clientSection);
syncRotation();

// Resolve the hash after all panels have been configured, not after a delayed reveal.
window.addEventListener('hashchange', () => {
  const id = fragmentId();
  if (solutionById.has(id)) scrollToService(id);
  else if (clientPanelById.has(id)) {
    selectSegment(id, { animate: false });
    clientPanelById.get(id).scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }
});
const initialTarget = document.getElementById(fragmentId());
if (initialTarget) requestAnimationFrame(() => initialTarget.scrollIntoView({ behavior: 'instant', block: 'start' }));

// Reveal effects never control access to content and run only once per section.
const entrances = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    entrances.unobserve(target);
    if (reducedMotion.matches) return;
    const siblings = [...target.parentElement.children];
    const delay = Math.min(siblings.indexOf(target) % 4, 3) * 55;
    target.animate([
      { opacity: 0.2, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 600, delay, fill: 'backwards', easing: 'cubic-bezier(.2,.75,.25,1)' });
  });
}, { threshold: 0.08 });
document.querySelectorAll('.about-story, .numbers, .purpose-card, .values-band, .challenge, .section-top, .solutions-workspace, .segment, .mapping-item, .testimonial, .hr-intro, .hr-services, .careers-grid, .contact-box, .und-about-layout, .und-talks-layout, .und-institutions, .course-card, .und-instructor-layout').forEach(item => entrances.observe(item));

// The opening gets its own brief sequence, only when it is the page's entry point.
document.fonts.ready.then(() => {
  if (reducedMotion.matches || (location.hash && location.hash !== '#inicio') || window.scrollY > 120) return;
  document.querySelectorAll('.hero .eyebrow, .und-logo-link, .hero-line, .hero-copy p, .und-hero-copy > p, .hero-actions').forEach((element, index) => element.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 780, delay: index * 85, fill: 'backwards', easing: 'cubic-bezier(.16,1,.3,1)' }));
  document.querySelector('.hero-photo')?.animate([
    { transform: 'scale(1.055)' }, { transform: 'scale(1)' }
  ], { duration: 2100, easing: 'cubic-bezier(.2,.65,.25,1)' });
});

// Only the visual value counts up; assistive technology receives the real total.
const numberObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    numberObserver.unobserve(target);
    if (reducedMotion.matches) return;
    const text = [...target.childNodes].find(node => node.nodeType === Node.TEXT_NODE && /\d/.test(node.textContent));
    if (!text) return;
    const original = text.textContent;
    const total = Number(original.replace(/[^0-9]/g, ''));
    const suffix = original.includes('mil') ? ' mil' : '';
    const visual = document.createElement('span');
    visual.className = 'count-value';
    visual.setAttribute('aria-hidden', 'true');
    visual.textContent = original;
    target.setAttribute('aria-label', target.textContent);
    target.replaceChild(visual, text);
    target.querySelectorAll('span').forEach(span => span.setAttribute('aria-hidden', 'true'));
    const start = performance.now();
    function tick(now) {
      const progress = reducedMotion.matches ? 1 : Math.min((now - start) / 1100, 1);
      const value = Math.round(total * (1 - Math.pow(1 - progress, 3)));
      visual.textContent = progress === 1 ? original : value.toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.numbers dt').forEach(item => numberObserver.observe(item));

reducedMotion.addEventListener('change', event => {
  if (event.matches) document.getAnimations().forEach(animation => animation.finish());
});
