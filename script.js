
/* =========================
   MOT DE PASSE
========================= */

// Mot de passe à communiquer aux invités.
// Attention : sensible aux majuscules et minuscules.
const ACCESS_CODE = 'TEST';


/* =========================
   TEXTES ET RÉGLAGES
========================= */

// Modifie les informations de l'événement ici.
const EVENT_TEXT = {
  title: 'Sainte-Barbe 2026',
  date: 'Samedi 9 janvier 2027',

  ballTime: 'Soirée dansante à partir de 20h00',
  orchestra: "Animée par Tem'Pow",
  orchestraUrl: 'https://www.tem-pow.fr/',

  facebookUrl: 'https://www.facebook.com/profile.php?id=100083337247301',
  instagramUrl: 'https://www.instagram.com/amicalespmachecoul?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==',
  odpUrl: 'https://www.pompiers.fr/oeuvre-des-pupilles/',
  catererUrl: 'https://www.traiteursoullandais.com/',
  djUrl: 'https://www.tem-pow.fr/',

  footer: 'Le CIS Machecoul vous remercie pour votre présence !'
};


/* =========================
   AFFICHAGE DES INFORMATIONS
========================= */

// Titre et date
document.title = EVENT_TEXT.title;

document.querySelector('#event-title').textContent =
  EVENT_TEXT.title;

document.querySelector('#event-date').textContent =
  EVENT_TEXT.date;


// Animation
document.querySelector('.card-body .placeholder-strong').textContent =
  EVENT_TEXT.ballTime;

document.querySelector('.card-body p:not(.placeholder-strong)').textContent =
  EVENT_TEXT.orchestra;

document.querySelector('.text-link').href =
  EVENT_TEXT.orchestraUrl;


// Liens utiles
const links = document.querySelectorAll('.links-list a');

links[0].href = EVENT_TEXT.facebookUrl;
links[1].href = EVENT_TEXT.instagramUrl;
links[2].href = EVENT_TEXT.odpUrl;
links[3].href = EVENT_TEXT.catererUrl;
links[4].href = EVENT_TEXT.djUrl;


// Pied de page
document.querySelector('.event-footer').textContent =
  EVENT_TEXT.footer;


/* =========================
   DÉVERROUILLAGE DE LA PAGE
========================= */

const accessForm = document.querySelector('#access-form');

accessForm.addEventListener('submit', (event) => {

  event.preventDefault();

  const entered = document.querySelector('#access-code').value;
  const error = document.querySelector('#access-error');

  // Comparaison exacte du mot de passe.
  if (entered === ACCESS_CODE) {

    document.querySelector('#access-screen').hidden = true;
    document.querySelector('#event-screen').hidden = false;

    error.textContent = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  } else {

    error.textContent = 'Code incorrect. Veuillez réessayer.';

    document.querySelector('#access-code').select();

  }

});
