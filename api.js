/**
 * API Backend pour les Services Informatique Ayoub
 * Gestion des emails, formulaires et données
 */

// Configuration de l'API
const API_CONFIG = {
  BASE_URL: '/api',
  VERSION: '1.0.0',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// État de l'application
const AppState = {
  isOnline: navigator.onLine,
  pendingEmails: [],
  formData: new Map(),
  settings: {
    enableEmailJS: false,
    enableNotifications: true,
    saveDrafts: true
  }
};

// Gestionnaire d'état
class StateManager {
  constructor() {
    this.listeners = new Set();
    this.loadState();
  }

  // Sauvegarder l'état dans le localStorage
  saveState() {
    try {
      const state = {
        pendingEmails: AppState.pendingEmails,
        formData: Array.from(AppState.formData.entries()),
        settings: AppState.settings,
        lastSave: Date.now()
      };
      localStorage.setItem('ayoub-services-state', JSON.stringify(state));
    } catch (error) {
      console.error('Erreur sauvegarde état:', error);
    }
  }

  // Charger l'état depuis localStorage
  loadState() {
    try {
      const saved = localStorage.getItem('ayoub-services-state');
      if (saved) {
        const state = JSON.parse(saved);
        AppState.pendingEmails = state.pendingEmails || [];
        AppState.formData = new Map(state.formData || []);
        AppState.settings = { ...AppState.settings, ...state.settings };
      }
    } catch (error) {
      console.error('Erreur chargement état:', error);
    }
  }

  // S'abonner aux changements d'état
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notifier les changements
  notify() {
    this.listeners.forEach(callback => callback(AppState));
    this.saveState();
  }

  // Mettre à jour l'état
  update(updates) {
    Object.assign(AppState, updates);
    this.notify();
  }
}

// Gestionnaire d'emails
class EmailManager {
  constructor() {
    this.stateManager = new StateManager();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      AppState.isOnline = true;
      this.stateManager.update({ isOnline: true });
      this.processPendingEmails();
    });

    window.addEventListener('offline', () => {
      AppState.isOnline = false;
      this.stateManager.update({ isOnline: false });
    });
  }

  // Traiter les emails en attente
  async processPendingEmails() {
    if (AppState.pendingEmails.length === 0) return;

    console.log(`📧 Traitement de ${AppState.pendingEmails.length} emails en attente...`);

    for (const email of [...AppState.pendingEmails]) {
      try {
        const result = await this.sendEmail(email.data, { showNotifications: false });
        if (result.success) {
          AppState.pendingEmails = AppState.pendingEmails.filter(e => e.id !== email.id);
          this.stateManager.update({ pendingEmails: AppState.pendingEmails });
        }
      } catch (error) {
        console.error('Erreur traitement email en attente:', error);
      }
    }
  }

  // Envoyer un email
  async sendEmail(formData, options = {}) {
    const { showNotifications = true, useEmailJS = AppState.settings.enableEmailJS } = options;

    const emailData = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      data: formData,
      status: 'sending'
    };

    // Si hors ligne, ajouter à la file d'attente
    if (!AppState.isOnline) {
      emailData.status = 'pending';
      AppState.pendingEmails.push(emailData);
      this.stateManager.update({ pendingEmails: AppState.pendingEmails });

      if (showNotifications) {
        this.showNotification('Hors ligne - Email ajouté à la file d\'attente', 'warning');
      }
      return { success: true, queued: true };
    }

    try {
      let result;

      // EmailJS uniquement - plus de mailto
      result = await this.sendViaEmailJS(formData);

      if (showNotifications && result.success) {
        this.showNotification('Email envoyé avec succès!', 'success');
      }

      return result;

    } catch (error) {
      console.error('Erreur envoi email:', error);

      // Ajouter à la file d'attente en cas d'erreur
      emailData.status = 'pending';
      AppState.pendingEmails.push(emailData);
      this.stateManager.update({ pendingEmails: AppState.pendingEmails });

      if (showNotifications) {
        this.showNotification('Erreur - Email ajouté à la file d\'attente', 'error');
      }

      return { success: false, error: error.message, queued: true };
    }
  }

  // Envoi via EmailJS
  async sendViaEmailJS(formData) {
    // Simulation - Remplacer par le vrai code EmailJS
    return new Promise((resolve) => {
      setTimeout(() => {
        // 95% de succès pour la démo
        if (Math.random() > 0.05) {
          resolve({ success: true, method: 'emailjs' });
        } else {
          throw new Error('Erreur serveur EmailJS');
        }
      }, 1500);
    });
  }

  // ⚠️ Plus de mailto - EmailJS uniquement

  // Afficher une notification
  showNotification(message, type = 'info') {
    // Utiliser l'API Notification si disponible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Services Informatique Ayoub', {
        body: message,
        icon: '/favicon.ico',
        tag: 'email-notification'
      });
    }

    // Fallback vers la notification personnalisée
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    // Styles selon le type
    const styles = {
      success: 'background: #10b981;',
      error: 'background: #ef4444;',
      warning: 'background: #f59e0b;',
      info: 'background: #3b82f6;'
    };

    if (styles[type]) {
      notification.style.background = styles[type];
    }

    document.body.appendChild(notification);

    // Animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// Gestionnaire de formulaires
class FormManager {
  constructor() {
    this.emailManager = new EmailManager();
    this.stateManager = new StateManager();
    this.setupForms();
  }

  setupForms() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      this.setupContactForm(contactForm);
    }

    // Auto-sauvegarde des brouillons
    this.setupAutoSave();
  }

  setupContactForm(form) {
    const fields = ['prenom', 'nom', 'email', 'telephone', 'prestation', 'objet', 'message'];

    // Restaurer les brouillons au chargement
    this.restoreDraft(form, fields);

    // Écouter les changements pour la sauvegarde automatique
    fields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.addEventListener('input', () => {
          this.saveDraft(form, fields);
        });
      }
    });

    // Gestion de la soumission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = this.getFormData(form);

      // Validation basique
      if (!this.validateForm(formData)) {
        this.showValidationErrors(form);
        return;
      }

      // Vérification du consentement
      const consent = form.querySelector('#consent');
      if (!consent?.checked) {
        this.showFieldError(consent, 'Vous devez accepter les conditions');
        return;
      }

      // Envoi de l'email
      const result = await this.emailManager.sendEmail(formData);

      if (result.success) {
        this.clearDraft(form);
        form.reset();
        this.showSuccessMessage(form);
      }
    });
  }

  getFormData(form) {
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.name) {
        data[input.name] = input.value;
      }
    });

    return data;
  }

  validateForm(data) {
    const errors = [];

    if (!data.prenom?.trim()) errors.push('Prénom requis');
    if (!data.nom?.trim()) errors.push('Nom requis');
    if (!data.email?.trim()) errors.push('Email requis');
    if (!data.telephone?.trim()) errors.push('Téléphone requis');
    if (!data.prestation?.trim()) errors.push('Prestation requise');
    if (!data.objet?.trim()) errors.push('Objet requis');
    if (!data.message?.trim()) errors.push('Message requis');

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Email invalide');
    }

    return errors.length === 0;
  }

  showValidationErrors(form) {
    // Réinitialiser les erreurs
    form.querySelectorAll('.error').forEach(el => {
      el.textContent = '';
    });

    // Afficher les erreurs spécifiques
    const prenom = form.querySelector('[name="prenom"]');
    const nom = form.querySelector('[name="nom"]');
    const email = form.querySelector('[name="email"]');

    if (prenom && !prenom.value.trim()) {
      this.showFieldError(prenom, 'Prénom requis');
    }
    if (nom && !nom.value.trim()) {
      this.showFieldError(nom, 'Nom requis');
    }
    if (email && !email.value.trim()) {
      this.showFieldError(email, 'Email requis');
    }
  }

  showFieldError(field, message) {
    const errorEl = field.closest('.field')?.querySelector('.error');
    if (errorEl) {
      errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    }
  }

  showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        ✅ Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.
      </div>
    `;

    form.insertBefore(successDiv, form.firstChild);

    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 5000);
  }

  saveDraft(form, fields) {
    if (!AppState.settings.saveDrafts) return;

    const draft = {};
    fields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        draft[fieldName] = field.value;
      }
    });

    const draftKey = `draft-${form.id || 'contact-form'}`;
    localStorage.setItem(draftKey, JSON.stringify({
      data: draft,
      timestamp: Date.now()
    }));
  }

  restoreDraft(form, fields) {
    const draftKey = `draft-${form.id || 'contact-form'}`;
    const saved = localStorage.getItem(draftKey);

    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved);
        // Restaurer seulement si le brouillon date de moins d'une heure
        if (Date.now() - timestamp < 3600000) {
          fields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && data[fieldName]) {
              field.value = data[fieldName];
            }
          });
        } else {
          localStorage.removeItem(draftKey);
        }
      } catch (error) {
        console.error('Erreur restauration brouillon:', error);
      }
    }
  }

  clearDraft(form) {
    const draftKey = `draft-${form.id || 'contact-form'}`;
    localStorage.removeItem(draftKey);
  }

  setupAutoSave() {
    // Sauvegarde automatique toutes les 30 secondes
    setInterval(() => {
      const form = document.getElementById('contact-form');
      if (form) {
        this.saveDraft(form, ['prenom', 'nom', 'email', 'telephone', 'prestation', 'objet', 'message']);
      }
    }, 30000);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initialisation de l\'API Backend...');

  // Initialiser les gestionnaires
  window.formManager = new FormManager();
  window.emailManager = new EmailManager();

  // Enregistrer le service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker enregistré:', registration);
      })
      .catch((error) => {
        console.error('❌ Erreur enregistrement Service Worker:', error);
      });
  }

  console.log('✅ API Backend initialisée');
});

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmailManager, FormManager, StateManager, AppState };
}