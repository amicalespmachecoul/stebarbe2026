/* =========================
   RÉGLAGE À MODIFIER
========================= */

// Code d'accès à communiquer aux invités.
// Court, sans accent. Majuscules, espaces autour et accents sont ignorés à la saisie.
// Attention : ce code est lisible par quiconque ouvre ce fichier (filtre « convivial » seulement).
const ACCESS_CODE = 'TEST';

// Tous les textes (titre, horaire, orchestre, liens, pied de page) se modifient dans index.html.


/* =========================
   OUTILS
========================= */

const $ = (selector) => document.querySelector(selector);

// Normalise un code : sans espaces autour, sans accents, en minuscules.
function normalize(value) {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Mémorise le déverrouillage pour la session (rechargement, retour depuis un lien).
// try/catch : le stockage peut être bloqué (navigation privée, etc.).
// La clé est aussi lue par le petit script placé dans le <head> de index.html.
const STORAGE_KEY = 'event-unlocked';

function isRemembered() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function remember() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* sans importance */
  }
}


/* =========================
   DÉVERROUILLAGE DE LA PAGE
========================= */

const accessScreen = $('#access-screen');
const eventScreen = $('#event-screen');
const accessForm = $('#access-form');
const accessInput = $('#access-code');
const accessError = $('#access-error');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function unlock({ focus = true, animate = true } = {}) {
  if (!accessScreen || !eventScreen) return;

  const show = () => {
    accessScreen.hidden = true;
    eventScreen.hidden = false;
    if (accessError) accessError.textContent = '';

    window.scrollTo(0, 0);

    // Place le focus sur le titre pour les lecteurs d'écran et le clavier.
    if (focus) {
      const title = $('#event-title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
      }
    }
  };

  // Fondu de l'écran d'accès, puis affichage de la page.
  if (animate && !prefersReducedMotion) {
    accessScreen.classList.add('is-leaving');
    setTimeout(show, 350);
  } else {
    show();
  }
}

if (isRemembered()) {
  unlock({ focus: false, animate: false });
}

if (accessForm && accessInput) {
  accessForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (normalize(accessInput.value) === normalize(ACCESS_CODE)) {
      remember();
      unlock();
    } else {
      if (accessError) accessError.textContent = 'Code incorrect. Veuillez réessayer.';
      accessInput.select();
    }
  });

  // Efface le message d'erreur dès que l'invité retape.
  accessInput.addEventListener('input', () => {
    if (accessError) accessError.textContent = '';
  });
}


/* =========================
   APPARITION DES CARTES AU SCROLL
========================= */

const cards = document.querySelectorAll('.event-card');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  cards.forEach((card) => revealObserver.observe(card));
} else {
  cards.forEach((card) => card.classList.add('is-visible'));
}


/* =========================
   BARRE DE NAVIGATION : SECTION ACTIVE
========================= */

const navLinks = document.querySelectorAll('.section-nav a');

if ('IntersectionObserver' in window && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => link.removeAttribute('aria-current'));
      $(`.section-nav a[href="#${entry.target.id}"]`)?.setAttribute('aria-current', 'true');
    }
  }, { rootMargin: '-40% 0px -55% 0px' });

  cards.forEach((card) => {
    if (card.id) sectionObserver.observe(card);
  });
}
