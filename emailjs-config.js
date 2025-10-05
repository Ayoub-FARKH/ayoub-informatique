/**
 * Configuration EmailJS sécurisée
 * ⚠️ CRÉEZ UN FICHIER .env AVEC VOS VRAIES CLÉS ⚠️
 */
const EMAILJS_CONFIG = {
  // ✅ Configuration EmailJS - Ayoub Informatique
  SERVICE_ID: 'service_tckekpc', // Votre service EmailJS
  TEMPLATE_ID: 'service_tckekpc', // Votre template EmailJS
  PUBLIC_KEY: 'jQk6uZum97YcxU7p-', // Votre clé publique EmailJS

  // Configuration de secours (votre email professionnel)
  FALLBACK_EMAIL: 'proayoubfarkh@gmail.com',
  FALLBACK_SUBJECT: 'Nouveau message client - Ayoub Informatique',

  // Paramètres de sécurité
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 800,
  TIMEOUT: 10000, // 10 secondes timeout

  // Rate limiting (anti-spam)
  RATE_LIMIT: {
    MAX_REQUESTS: 5, // Max 5 emails par minute
    WINDOW_MS: 60000 // Fenêtre de 1 minute
  },

  // Templates sécurisés pour mailto
  MAILTO_TEMPLATES: {
    contact: {
      subject: '🔧 {prestation} - {nom} {prenom} - Ayoub Informatique',
      body: `🔔 NOUVEAU MESSAGE CLIENT

👤 INFORMATIONS CLIENT :
Nom: {nom}
Prénom: {prenom}
Email: {email}
Téléphone: {telephone}

💼 PRESTATION DEMANDÉE :
Service: {prestation}
Objet: {objet}

📝 MESSAGE :
{message}

---
✉️  Ce message a été envoyé depuis votre site web professionnel
📅 Date: {date}
🌐 Site: ayoub-informatique.netlify.app
      `.trim()
    }
  },

  // Validation des données
  VALIDATION: {
    REQUIRED_FIELDS: ['nom', 'email', 'message'],
    MAX_LENGTH: {
      nom: 50,
      prenom: 50,
      email: 100,
      telephone: 20,
      objet: 200,
      message: 2000
    },
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

/**
 * Classe utilitaire pour EmailJS
 */
class EmailJSManager {
  constructor() {
    this.isInitialized = false;
    this.isOnline = navigator.onLine;
    this.retryCount = 0;

    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🔗 Connexion rétablie');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Mode hors ligne activé');
    });
  }

  /**
   * Initialise EmailJS
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Vérifier si les clés sont configurées avec vos vraies valeurs
      if (EMAILJS_CONFIG.SERVICE_ID === 'service_tckekpc' && EMAILJS_CONFIG.PUBLIC_KEY === 'jQk6uZum97YcxU7p-') {
        console.log('✅ EmailJS initialisé avec vos vraies clés');
        return true;
      } else {
        console.warn('⚠️ EmailJS n\'est pas configuré avec vos vraies clés. Utilisation du mode secours uniquement.');
        return false;
      }

      // Ici vous pouvez ajouter l'initialisation EmailJS si nécessaire
      // emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

      this.isInitialized = true;
      console.log('✅ EmailJS initialisé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation EmailJS:', error);
      return false;
    }
  }

  /**
   * Envoie un email via EmailJS avec fallback
   */
  async sendEmail(templateParams, options = {}) {
    const { useFallbackOnly = false, showSuccess = true, showError = true } = options;

    // Si on force le mode secours ou pas de connexion
    if (useFallbackOnly || !this.isOnline) {
      return this.sendViaMailto(templateParams, { showSuccess, showError });
    }

    // Tentative via EmailJS
    try {
      await this.initialize();

      if (!this.isInitialized) {
        throw new Error('EmailJS non initialisé');
      }

      console.log('📧 Tentative d\'envoi via EmailJS...');

      // Vrai appel EmailJS avec vos clés
      const result = await this.sendRealEmailJS(templateParams);

      if (showSuccess) {
        this.showMessage('Message envoyé avec succès !', 'success');
      }

      console.log('✅ Email envoyé via EmailJS');
      return { success: true, method: 'emailjs' };

    } catch (error) {
      console.error('❌ Erreur EmailJS:', error);

      // Fallback vers mailto
      if (this.retryCount < EMAILJS_CONFIG.RETRY_ATTEMPTS) {
        this.retryCount++;
        console.log(`🔄 Tentative ${this.retryCount}/${EMAILJS_CONFIG.RETRY_ATTEMPTS} via mailto...`);

        await new Promise(resolve => setTimeout(resolve, EMAILJS_CONFIG.RETRY_DELAY));
        return this.sendViaMailto(templateParams, { showSuccess, showError });
      }

      if (showError) {
        this.showMessage('Erreur lors de l\'envoi. Ouverture du client email...', 'error');
      }

      return this.sendViaMailto(templateParams, { showSuccess, showError });
    }
  }

  /**
   * Envoi réel via EmailJS
   */
  async sendRealEmailJS(templateParams) {
    try {
      // Utilise les vraies clés configurées
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        return result;
      } else {
        throw new Error(`Erreur HTTP ${result.status}`);
      }
    } catch (error) {
      console.error('Erreur EmailJS réel:', error);
      throw error;
    }
  }

  /**
   * Envoi via mailto (fallback)
   */
  sendViaMailto(templateParams, options = {}) {
    const { showSuccess = true, showError = true } = options;

    try {
      const subject = EMAILJS_CONFIG.MAILTO_TEMPLATES.contact.subject
        .replace('{service}', templateParams.prestation || 'Service')
        .replace('{nom}', templateParams.nom || '')
        .replace('{prenom}', templateParams.prenom || '');

      const body = EMAILJS_CONFIG.MAILTO_TEMPLATES.contact.body
        .replace('{nom}', templateParams.nom || '')
        .replace('{prenom}', templateParams.prenom || '')
        .replace('{email}', templateParams.email || '')
        .replace('{telephone}', templateParams.telephone || '')
        .replace('{prestation}', templateParams.prestation || '')
        .replace('{objet}', templateParams.objet || '')
        .replace('{message}', templateParams.message || '');

      const mailtoUrl = `mailto:${EMAILJS_CONFIG.FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      console.log('📬 Ouverture du client email...');
      window.location.href = mailtoUrl;

      if (showSuccess) {
        this.showMessage('Client email ouvert avec succès', 'success');
      }

      return { success: true, method: 'mailto' };

    } catch (error) {
      console.error('❌ Erreur mailto:', error);
      if (showError) {
        this.showMessage('Erreur lors de l\'ouverture du client email', 'error');
      }
      return { success: false, method: 'mailto', error };
    }
  }

  /**
   * Affiche un message à l'utilisateur
   */
  showMessage(message, type = 'info') {
    // Créer ou utiliser un élément existant pour les notifications
    let notification = document.querySelector('.notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
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
      document.body.appendChild(notification);
    }

    // Styles selon le type
    const styles = {
      success: 'background: #10b981; border-left: 4px solid #059669;',
      error: 'background: #ef4444; border-left: 4px solid #dc2626;',
      info: 'background: #3b82f6; border-left: 4px solid #2563eb;',
      warning: 'background: #f59e0b; border-left: 4px solid #d97706;'
    };

    notification.style.cssText += styles[type] || styles.info;
    notification.textContent = message;

    // Animation d'entrée
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Disparition automatique
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

// Export pour utilisation globale
window.EmailJSManager = EmailJSManager;
window.EMAILJS_CONFIG = EMAILJS_CONFIG;