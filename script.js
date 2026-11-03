// Duratech Construction website interactions — frontend only.
// IMPORTANT: replace this placeholder with the official WhatsApp number before publishing.
// Format: country code + number, digits only. For a Nigerian mobile number, use 234XXXXXXXXXX.
const WHATSAPP_NUMBER = "2348023156141";

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const backTop = document.querySelector('.back-top');
const updateBackTop = () => {
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
};
window.addEventListener('scroll', updateBackTop, { passive: true });
updateBackTop();

// Mark the navigation link for the section currently in view.
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Scroll reveal animation with a reduced-motion fallback.
const revealTargets = document.querySelectorAll('.service-mini, .about-image-wrap, .about-copy, .why-card, .project-card, .faq-intro, .faq-item, .contact-form, .contact-copy');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((item, index) => {
    item.classList.add('js-reveal');
    if (item.classList.contains('service-mini') || item.classList.contains('why-card') || item.classList.contains('project-card')) {
      item.style.transitionDelay = `${(index % 4) * 65}ms`;
    }
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(item => revealObserver.observe(item));
}

function isConfiguredWhatsAppNumber(number) {
  return /^\d{10,15}$/.test(number) && !/[xX]/.test(number);
}
function openWhatsApp(message) {
  const status = document.getElementById('form-status');
  if (!isConfiguredWhatsAppNumber(WHATSAPP_NUMBER)) {
    document.getElementById('contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const message = [
      'Hello Duratech Construction, I would like to make a project enquiry.',
      '',
      `Name: ${data.get('fullName')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email') || 'Not provided'}`,
      `Service: ${data.get('service')}`,
      `Project location: ${data.get('location') || 'Not provided'}`,
      '',
      'Project details:',
      data.get('message')
    ].join('\n');
    openWhatsApp(message);
  });
}

const floatingWhatsApp = document.getElementById('whatsapp-float');
if (floatingWhatsApp) {
  floatingWhatsApp.addEventListener('click', event => {
    event.preventDefault();
    openWhatsApp('Hello Duratech Construction, I would like to discuss a construction project.');
  });
}
