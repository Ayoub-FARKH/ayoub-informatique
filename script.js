// Utilitaires
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Gestionnaire d'effets visuels
class VisualEffects {
  constructor() {
    this.initParticles();
    this.initCounters();
    this.initThemeToggle();
    this.initScrollEffects();
    this.initInteractiveElements();
  }

  // Système de particules animées (optimisé)
  initParticles() {
    const particlesContainer = $('#particles');
    if (!particlesContainer) return;

    const particleCount = 15; // Réduit pour les performances

    // Créer les particules de manière optimisée
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 8) + 's';

      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
  }

  // Compteurs animés STABLES
  initCounters() {
    const counters = $$('.stat-counter');
    let animationsRunning = new Set(); // Éviter les animations multiples

    const animateCounter = (counter) => {
      // Éviter les animations multiples sur le même élément
      if (animationsRunning.has(counter)) return;
      animationsRunning.add(counter);

      const target = parseInt(counter.dataset.target) || 0;
      const duration = 1500; // Plus rapide et stable
      const fps = 60;
      const totalFrames = (duration / 1000) * fps;
      const increment = target / totalFrames;
      let current = 0;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        current += increment;

        // Animation plus fluide avec easing
        const progress = frame / totalFrames;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const easedValue = Math.floor(target * easedProgress);

        counter.textContent = easedValue;

        if (frame >= totalFrames) {
          counter.textContent = target;
          clearInterval(timer);
          animationsRunning.delete(counter);
        }
      }, 1000 / fps);
    };

    // Observer pour déclencher l'animation quand visible
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationsRunning.has(entry.target)) {
          // Délai pour éviter les déclenchements multiples
          setTimeout(() => animateCounter(entry.target), 100);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => {
      if (counter.dataset.target) {
        counterObserver.observe(counter);
      }
    });
  }

  // Toggle thème sombre/clair
  initThemeToggle() {
    const themeToggle = $('#theme-toggle');
    if (!themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    console.log('Theme toggle initialized');

    // Vérifier le thème sauvegardé ou la préférence système
    const savedTheme = localStorage.getItem('theme') ||
                      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    // Appliquer le thème initial
    this.applyTheme(savedTheme);

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'light' : 'dark');
      }
    });

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      this.applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);

      // Animation du toggle
      themeToggle.style.transform = 'scale(0.8)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 150);

      console.log('Theme switched to:', newTheme);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcon(theme);

    // Ajouter une classe pour les transitions en CSS
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }

  updateThemeIcon(theme) {
    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      const button = themeToggle;

      if (theme === 'dark') {
        icon.textContent = '☀️';
        button.title = 'Passer en mode clair';
        button.setAttribute('aria-label', 'Thème actuel: sombre - cliquer pour passer en mode clair');
      } else {
        icon.textContent = '🌙';
        button.title = 'Passer en mode sombre';
        button.setAttribute('aria-label', 'Thème actuel: clair - cliquer pour passer en mode sombre');
      }

      console.log('Theme icon updated for theme:', theme);
    }
  }

  // Effets de scroll avancés
  initScrollEffects() {
    let ticking = false;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;

      // Révélation des éléments (sans toucher au header)
      $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

        if (isVisible && !el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    });
  }

  // Éléments interactifs
  initInteractiveElements() {
    // Boutons avec effets de ripple
    $$('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        btn.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Effets de survol sur les cartes
    $$('.card, .faq-item').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Animations des FAQ
    $$('.faq-item').forEach(faq => {
      const question = faq.querySelector('.faq-question');
      const arrow = faq.querySelector('.faq-arrow');

      faq.addEventListener('toggle', () => {
        if (faq.open) {
          arrow.style.transform = 'rotate(90deg)';
          question.classList.add('active');
        } else {
          arrow.style.transform = 'rotate(0deg)';
          question.classList.remove('active');
        }
      });
    });
  }

  // Système de notifications toast
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${this.getToastIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 100);

    // Suppression automatique
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);

    return toast;
  }

  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }
}

// Fonction de test du thème (pour débogage)
window.testTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  console.log('Testing theme switch from', currentTheme, 'to', newTheme);

  // Appliquer le nouveau thème
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Mettre à jour l'icône
  const themeToggle = $('#theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.title = newTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
  }

  console.log('Theme switched to:', newTheme);
  alert(`Thème changé en: ${newTheme === 'dark' ? 'Sombre' : 'Clair'}`);
};

// Initialiser les effets visuels
document.addEventListener('DOMContentLoaded', () => {
  window.visualEffects = new VisualEffects();

  // Test automatique du thème après 1 seconde
  setTimeout(() => {
    console.log('🎨 Theme system initialized');
    console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Theme toggle element:', $('#theme-toggle'));

    // Afficher le debug visuel si en développement
    if (localStorage.getItem('debug') === 'true') {
      const debugEl = $('#theme-debug');
      if (debugEl) {
        debugEl.style.display = 'block';
        const currentThemeEl = $('#current-theme');
        if (currentThemeEl) {
          currentThemeEl.textContent = document.documentElement.getAttribute('data-theme') || 'dark';
        }
      }
    }
  }, 1000);

  // Mettre à jour le debug quand le thème change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const newTheme = document.documentElement.getAttribute('data-theme');
        console.log('🎨 Theme changed to:', newTheme);

        if (localStorage.getItem('debug') === 'true') {
          const currentThemeEl = $('#current-theme');
          if (currentThemeEl) {
            currentThemeEl.textContent = newTheme;
          }
        }
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
});

// Nav burger
(function nav() {
  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // close on link click (mobile)
  $$('#nav-menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

// Year
(function year() {
  const y = new Date().getFullYear();
  const el = $('#year');
  if (el) el.textContent = String(y);
})();

// Reveal on scroll
(function reveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// Back to top
(function backToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Pré-remplir prestation depuis boutons
(function serviceButtons() {
  $$('.card-cta [data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = btn.getAttribute('data-service');
      const href = btn.getAttribute('href');
      // Si le bouton pointe vers une ancre (#contact), on préremplit; sinon on laisse la redirection normale
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const s = document.querySelector('#prestation');
        if (s && service) {
          for (const opt of s.options) if (opt.textContent === service) s.value = opt.value;
        }
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// Formulaire avec backend intégré
(function contactForm() {
  const form = $('#contact-form');
  if (!form) return;

  // Le système de formulaire est maintenant géré par api.js
  // Cette fonction sert de fallback au cas où api.js ne se chargerait pas

  function updateFallbacks() {
    const fields = {
      prenom: $('#prenom'),
      nom: $('#nom'),
      email: $('#email'),
      telephone: $('#telephone'),
      prestation: $('#prestation'),
      objet: $('#objet'),
      message: $('#message'),
      consent: $('#consent'),
    };

    if (!fields.prenom || !fields.nom) return;

    const subject = `Demande - ${fields.prestation?.value || 'Service'} - ${fields.prenom.value} ${fields.nom.value}`;
    const body = `Prénom: ${fields.prenom.value}
Nom: ${fields.nom.value}
Email: ${fields.email?.value || ''}
Téléphone: ${fields.telephone?.value || ''}
Prestation: ${fields.prestation?.value || ''}
Objet: ${fields.objet?.value || ''}

Message:
${fields.message?.value || ''}`;

    const mailtoLink = $('#mailto-fallback');
    const whatsappLink = $('#whatsapp-fallback');

    // ⚠️ Plus de mailto - EmailJS uniquement

    if (whatsappLink) {
      const whatsappText = `Bonjour, je souhaite une prestation ${fields.prestation?.value || 'informatique'}. ${fields.message?.value || ''}`;
      const whatsappHref = `https://wa.me/33629369846?text=${encodeURIComponent(whatsappText)}`;
      whatsappLink.setAttribute('href', whatsappHref);
    }
  }

  // Fallback si le système backend n'est pas disponible
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Si le système backend est disponible, ne rien faire (il gère déjà le formulaire)
    if (window.formManager || window.emailManager) {
      return;
    }

    // Sinon, utiliser le système de fallback
    const fields = {
      prenom: $('#prenom'),
      nom: $('#nom'),
      email: $('#email'),
      telephone: $('#telephone'),
      prestation: $('#prestation'),
      objet: $('#objet'),
      message: $('#message'),
      consent: $('#consent'),
    };

    // Validation basique
    let isValid = true;
    if (fields.prenom?.value.trim().length < 2) { isValid = false; }
    if (fields.nom?.value.trim().length < 2) { isValid = false; }
    if (fields.email?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) { isValid = false; }
    if (!fields.prestation?.value) { isValid = false; }
    if (fields.objet?.value.trim().length < 3) { isValid = false; }
    if (fields.message?.value.trim().length < 10) { isValid = false; }
    if (!fields.consent?.checked) { isValid = false; }

    if (!isValid) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    updateFallbacks();
    const mailtoLink = $('#mailto-fallback');
    if (mailtoLink) {
      window.location.href = mailtoLink.getAttribute('href');
    }
  });

  // Mettre à jour les fallbacks lors des changements
  form.addEventListener('input', updateFallbacks);
  updateFallbacks();
})();

// Navigation mobile qui disparaît au scroll
(function mobileNavScroll() {
  const nav = $('.main-nav');
  if (!nav) return;

  let lastScrollTop = 0;
  let scrollTimeout;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Seulement sur mobile
    if (window.innerWidth <= 768) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - cacher la navigation
        nav.classList.add('hidden');
      } else {
        // Scroll vers le haut - montrer la navigation
        nav.classList.remove('hidden');
      }
    } else {
      // Sur desktop, toujours visible
      nav.classList.remove('hidden');
    }

    lastScrollTop = scrollTop;

    // Clear le timeout précédent
    clearTimeout(scrollTimeout);
    // Remettre la navigation visible après 3 secondes d'inactivité
    scrollTimeout = setTimeout(() => {
      nav.classList.remove('hidden');
    }, 3000);
  }

  // Écouter le scroll
  window.addEventListener('scroll', handleScroll);

  // Remettre la navigation visible au redimensionnement
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      nav.classList.remove('hidden');
    }
  });

  console.log('📱 Navigation mobile avec scroll activée');
})();
