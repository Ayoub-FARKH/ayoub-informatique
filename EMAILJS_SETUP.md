# Guide d'intégration EmailJS

## Configuration EmailJS

Pour activer l'envoi d'emails via EmailJS, suivez ces étapes :

### 1. Créer un compte EmailJS

1. Rendez-vous sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Ajoutez un service email (Gmail, Outlook, etc.)

### 2. Configurer le service

1. Dans votre dashboard EmailJS, créez un nouveau service email
2. Notez l'**Email Service ID**
3. Créez un template d'email
4. Notez l'**Email Template ID**

### 3. Mettre à jour la configuration

Modifiez le fichier `emailjs-config.js` :

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',     // Remplacez par votre Service ID
  TEMPLATE_ID: 'your_actual_template_id',   // Remplacez par votre Template ID
  PUBLIC_KEY: 'your_actual_public_key',     // Remplacez par votre Public Key
  // ... autres paramètres
};
```

### 4. Configurer le template d'email

Dans votre template EmailJS, utilisez ces variables :

```
Nom: {{nom}}
Prénom: {{prenom}}
Email: {{email}}
Téléphone: {{telephone}}
Prestation: {{prestation}}
Objet: {{objet}}
Message: {{message}}
Date: {{date}}
```

### 5. Activer EmailJS dans l'application

Dans le fichier `api.js`, modifiez cette ligne :

```javascript
settings: {
  enableEmailJS: true,  // Passez à true pour activer EmailJS
  enableNotifications: true,
  saveDrafts: true
}
```

## Fonctionnalités disponibles

### ✅ Système de fallback automatique

- **EmailJS principal** : Envoi direct via serveur
- **Mailto fallback** : Ouverture du client email local
- **Hors ligne** : File d'attente pour envoi ultérieur

### ✅ Gestion des erreurs

- Retry automatique (3 tentatives)
- Notifications utilisateur
- Console logging détaillé
- Gestion des timeouts

### ✅ Fonctionnalités avancées

- **Service Worker** : Mise en cache et fonctionnement hors ligne
- **Sauvegarde automatique** : Brouillons toutes les 30 secondes
- **Validation temps réel** : Messages d'erreur accessibles
- **Gestion d'état** : Synchronisation locale des données

## Structure des fichiers

```
├── index.html              # Page principale
├── emailjs-config.js       # Configuration EmailJS
├── api.js                  # Gestionnaire backend/API
├── sw.js                   # Service Worker (cache, offline)
├── script.js               # Fonctionnalités frontend
└── styles.css              # Styles et responsive
```

## Utilisation

### Envoi d'email automatique

```javascript
// L'envoi se fait automatiquement lors de la soumission du formulaire
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Le système backend gère l'envoi automatiquement
});
```

### Envoi manuel

```javascript
// Envoi programmatique
const formData = {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com',
  // ... autres champs
};

window.emailManager.sendEmail(formData)
  .then(result => {
    console.log('Email envoyé:', result);
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
```

## Templates EmailJS suggérés

### Template HTML pour emails

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouveau message - {{prestation}}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">Nouveau message depuis le site web</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; background: #fff; border-radius: 4px; margin: 5px 0;">
          <strong>Nom:</strong> {{nom}} {{prenom}}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; background: #fff; border-radius: 4px; margin: 5px 0;">
          <strong>Contact:</strong> {{email}} / {{telephone}}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; background: #fff; border-radius: 4px; margin: 5px 0;">
          <strong>Prestation:</strong> {{prestation}}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; background: #fff; border-radius: 4px; margin: 5px 0;">
          <strong>Objet:</strong> {{objet}}
        </td>
      </tr>
    </table>

    <div style="margin: 20px 0; padding: 15px; background: #fff; border-radius: 4px;">
      <strong>Message:</strong><br>
      {{message}}
    </div>

    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
      Message envoyé le {{date}} depuis le formulaire de contact
    </div>
  </div>
</body>
</html>
```

## Support navigateur

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ iOS Safari 11+
- ✅ Android Chrome 60+

## Sécurité

- 🔒 Pas de stockage serveur des données sensibles
- 🔒 Validation côté client complète
- 🔒 Gestion RGPD intégrée
- 🔒 Service Worker pour la confidentialité

## Debugging

### Activer les logs détaillés

```javascript
// Dans la console du navigateur
localStorage.setItem('debug', 'true');
location.reload();
```

### Vérifier la configuration

```javascript
// Dans la console
console.log('EmailJS Config:', window.EMAILJS_CONFIG);
console.log('App State:', window.AppState);
```

## Migration depuis l'ancien système

L'ancien système mailto est conservé comme fallback. Pour migrer complètement :

1. Configurez EmailJS (voir étapes ci-dessus)
2. Activez `enableEmailJS: true` dans `api.js`
3. Testez l'envoi d'emails
4. Supprimez les boutons mailto/Whatsapp du formulaire si souhaité

## Support

Pour toute question ou problème :

1. Consultez les logs de la console
2. Vérifiez la configuration EmailJS
3. Testez la connexion internet
4. Vérifiez les permissions du service worker