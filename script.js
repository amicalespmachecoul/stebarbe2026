/* =========================
   RÉGLAGES À MODIFIER
========================= */

// Code d'accès à communiquer aux invités.
// Court, sans accent. Majuscules, espaces autour et accents sont ignorés à la saisie.
const ACCESS_CODE = 'TEST';

const EVENT_TEXT = {
  title: 'Sainte Barbe 2026',

  ballTime: 'À partir de 20h00',
  orchestra: "Animée par Tem'Pow",

  footer: 'Le CIS Machecoul vous remercie pour votre présence !'
};

// Liens : la clé est un morceau du nom du fichier logo (images/logo-XXX.png).
// L'ordre des liens dans le HTML n'a donc plus d'importance.
const LINKS = {
  'logo-fb':      'https://www.facebook.com/profile.php?id=100083337247301',
  'logo-insta':   'https://www.instagram.com/amicalespmachecoul',
  'logo-odp':     'https://www.pompiers.fr/oeuvre-des-pupilles/',
  'logo-traiteur': 'https://www.traiteursoullandais.com/',
  'logo-dj':      'https://www.tem-pow.fr/'
};



// Indique au CSS que JavaScript fonctionne (active l'apparition des cartes au scroll).
document.documentElement.classList.add('js');


/* =========================
   OUTILS
========================= */

const $ = (selector) => document.querySelector(selector);

// Remplit un texte sans jamais planter si l'élément n'existe pas.
function setText(selector, text) {
  const el = $(selector);
  if (el) el.textContent = text;
}

// Normalise un code : sans espaces autour, sans accents, en minuscules.
function normalize(value) {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Mémorise le déverrouillage pour la session (rechargement de page, retour depuis un lien).
// Entouré de try/catch : le stockage peut être bloqué (navigation privée, etc.).
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
   AFFICHAGE DES INFORMATIONS
========================= */

document.title = EVENT_TEXT.title;
setText('#event-title', EVENT_TEXT.title);
setText('.card-body .placeholder-strong', EVENT_TEXT.ballTime);
setText('.card-body p:not(.placeholder-strong)', EVENT_TEXT.orchestra);
setText('.event-footer', EVENT_TEXT.footer);

// Liens utiles : on retrouve chaque lien grâce au nom du logo qu'il contient.
for (const [logoName, url] of Object.entries(LINKS)) {
  const link = $(`.links-list img[src*="${logoName}"]`)?.closest('a');
  if (link) link.href = url;
}

// Les titres des cartes utilisent des lettres décoratives (police Hello) :
// on donne leur vrai nom aux lecteurs d'écran.
const HEADING_LABELS = {
  '#menu-heading': 'Menu',
  '#animation-heading': 'Animation',
  '#links-heading': 'Liens'
};

for (const [selector, label] of Object.entries(HEADING_LABELS)) {
  $(selector)?.setAttribute('aria-label', label);
}


/* =========================
   DÉVERROUILLAGE DE LA PAGE
========================= */

const accessScreen = $('#access-screen');
const eventScreen = $('#event-screen');
const accessForm = $('#access-form');
const accessInput = $('#access-code');
const accessError = $('#access-error');

// Évite la majuscule automatique et la correction sur mobile.
if (accessInput) {
  accessInput.setAttribute('autocapitalize', 'off');
  accessInput.setAttribute('autocorrect', 'off');
  accessInput.setAttribute('spellcheck', 'false');
}

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

  document.querySelectorAll('.event-card[id]').forEach((section) => sectionObserver.observe(section));
}
