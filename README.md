<div align="center">

# 🚀 Services Informatique - Ayoub

[![🔥 Site Web](https://img.shields.io/badge/🔥_Site_Web-Démarrer-blue?style=for-the-badge&logo=github)](https://ayoub-services-informatique.github.io)
[![📚 Documentation](https://img.shields.io/badge/📚_Documentation-Complète-green?style=for-the-badge&logo=readthedocs)](https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io/wiki)
[![⭐ Stars](https://img.shields.io/github/stars/ayoub-services-informatique/ayoub-services-informatique.github.io?style=for-the-badge&logo=github)](https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io/stargazers)
[![📝 License](https://img.shields.io/badge/📝_License-MIT-yellow?style=for-the-badge&logo=open-source-initiative)](https://opensource.org/licenses/MIT)
[![🚀 Node.js](https://img.shields.io/badge/🚀_Node.js-%3E%3D14.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/)

---

### 🎯 **Services Professionnels**
🖥️ **Montage PC sur mesure** • 💾 **Récupération de données** • 🔧 **Maintenance informatique**

[📞 Me contacter](https://wa.me/33629369846) • [📧 Email](mailto:proayoubfarkh@gmail.com) • [🌐 Site Web](https://ayoub-services-informatique.github.io)

</div>

## ✨ Fonctionnalités

| 🎨 **Design** | 🚀 **Performance** | 🔒 **Sécurité** |
|:---:|:---:|:---:|
| 📱 Responsive Design | ⚡ Chargement rapide | 🔐 Respect RGPD |
| 🌙 Mode sombre/clair | 💾 Optimisé mobile | 🛡️ Données sécurisées |
| ✨ Animations fluides | 🔄 Mode hors ligne | 🚫 Anti-XSS |
| 🎯 UX moderne | 📦 Build optimisé | 🔒 Headers sécurisés |

### 🛠️ **Services Informatique**
- **📦 Montage PC sur mesure** - Configuration personnalisée selon vos besoins
- **💾 Récupération de données** - HDD/SSD, diagnostic et récupération
- **🔧 Maintenance informatique** - Réparation et optimisation
- **📱 Support mobile** - Interventions à domicile selon zone géographique
- **⚡ Service rapide** - Délais optimisés et suivi personnalisé

### 🌐 **Technologies**
- **📧 Intégration EmailJS** - Système d'envoi d'emails professionnel
- **🔄 PWA Ready** - Fonctionnement hors ligne
- **📊 Analytics intégré** - Suivi des performances
- **🎨 Thème adaptatif** - Interface moderne et accessible

### 📡 **API Endpoints**
| Endpoint | Méthode | Description |
|:---:|:---:|:---|
| `/api/send-email` | POST | Envoi d'email via EmailJS |
| `/api/save-draft` | POST | Sauvegarde brouillon formulaire |
| `/api/get-drafts/:id` | GET | Récupération des brouillons |
| `/api/validate-form` | POST | Validation formulaire côté serveur |
| `/api/stats` | GET | Statistiques serveur |

### ⚙️ **Configuration EmailJS**

#### **1. Créer un compte**
- 📝 [Inscription EmailJS](https://www.emailjs.com/)
- 🔧 Configuration service email (Gmail/Outlook)
- 📋 Création template email

#### **2. Configuration**
```javascript
// Dans emailjs-config.js
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id',
  PUBLIC_KEY: 'your_public_key'
};
```

#### **3. Activation**
```javascript
// Dans api.js
settings: {
  enableEmailJS: true  // Activer EmailJS
}
```

---

## 📞 Contact & Support

<div align="center">

### 🛠️ **Support Technique**
📧 **Email** : [proayoubfarkh@gmail.com](mailto:proayoubfarkh@gmail.com)
📱 **WhatsApp** : [+33 6 29 36 98 46](https://wa.me/33629369846)
🌐 **Site Web** : [ayoub-services-informatique.github.io](https://ayoub-services-informatique.github.io)

### 📍 **Zone d'intervention**
🏠 **À domicile** : Selon zone géographique
🚚 **Retrait/Livraison** : Disponible
⚡ **Délais** : 24-72h selon prestation

</div>

## 🚀 Démarrage rapide

### ✅ **Prérequis**
- **Node.js** >= 14.0.0 ([Télécharger](https://nodejs.org/))
- **npm** >= 6.0.0 (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))

### 📦 **Installation**

```bash
# 1. Cloner le repository
git clone https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io.git
cd ayoub-services-informatique.github.io

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm start
```

### 🌐 **Accès au site**
- **Site local** : http://localhost:3000
- **Site production** : https://ayoub-services-informatique.github.io

### Commandes disponibles

```bash
# Développement
npm start          # Démarrer le serveur de développement (port 3000)
npm run dev        # Mode développement avec rechargement automatique
npm run serve      # Serveur de production local (port 8080)

# Build et déploiement
npm run build      # Construire pour la production
npm run build:prod # Build optimisé pour la production
npm run deploy     # Déployer sur GitHub Pages

# Qualité du code
npm run lint       # Vérifier le code (HTML, CSS, JS)
npm run lint:fix   # Corriger automatiquement les erreurs ESLint
npm run validate   # Valider le HTML

# Analyse et optimisation
npm run analyze    # Analyser les performances avec Lighthouse
npm run security   # Vérification de sécurité

# Utilitaires
npm run clean      # Nettoyer les fichiers temporaires
npm run backup     # Créer une sauvegarde
npm run setup      # Configuration initiale
```

## 🌐 Développement local

### Serveur de développement

Le serveur de développement offre :

- **🔄 Rechargement automatique** - Modifications appliquées instantanément
- **📱 Support mobile** - Test sur tous les appareils
- **🔒 HTTPS optionnel** - Pour les tests de fonctionnalités sécurisées
- **📡 API intégrée** - Endpoints pour EmailJS et formulaires
- **🐛 Debug tools** - Console et outils de développement

### Accès au site

Une fois le serveur démarré :

- **Site principal** : http://localhost:3000
- **API** : http://localhost:3000/api/*
- **Service Worker** : Disponible pour les tests PWA

### Configuration EmailJS (optionnel)

Pour activer l'envoi d'emails automatique :

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Configurez un service email et un template
3. Modifiez `emailjs-config.js` avec vos clés API
4. Activez EmailJS dans `api.js`

Voir [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) pour le guide complet.

## 📁 Structure du projet

```
├── index.html              # Page d'accueil
├── mentions-legales.html   # Mentions légales
├── services/               # Pages des services
│   ├── montage.html       # Montage PC
│   ├── maintenance.html   # Maintenance
│   └── recuperation-donnees.html
├── styles.css             # Styles principaux
├── script.js              # JavaScript frontend
├── api.js                 # Gestionnaire backend
├── emailjs-config.js      # Configuration EmailJS
├── sw.js                  # Service Worker (PWA)
├── server.js              # Serveur de développement
├── build.js               # Script de build
├── package.json           # Configuration npm
├── .eslintrc.js           # Configuration ESLint
├── .gitignore             # Fichiers à ignorer
└── README.md              # Documentation
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` pour personnaliser la configuration :

```env
# Serveur
PORT=3000
HOST=localhost
NODE_ENV=development

# EmailJS (quand configuré)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key

# Sécurité
HTTPS=true
SSL_KEY_PATH=./ssl/key.pem
SSL_CERT_PATH=./ssl/cert.pem

# Analytics (optionnel)
GOOGLE_ANALYTICS_ID=your_ga_id
```

### Scripts personnalisés

Vous pouvez ajouter des scripts personnalisés dans `package.json` :

```json
{
  "scripts": {
    "custom-script": "node custom-script.js",
    "watch": "nodemon server.js"
  }
}
```

## 🚀 Déploiement GitHub Pages

### ⚡ **Déploiement automatique (recommandé)**

```bash
# 1. Build et déploiement en une commande
npm run deploy

# 2. Le site sera automatiquement disponible sur :
# https://ayoub-services-informatique.github.io
```

### 🔧 **Déploiement manuel**

```bash
# 1. Construire le site pour la production
npm run build:prod

# 2. Ajouter les fichiers buildés
git add dist -f

# 3. Commit les changements
git commit -m "🚀 Build de production - $(date +'%Y-%m-%d')"

# 4. Déployer sur GitHub Pages
git subtree push --prefix dist origin gh-pages

# 5. Le site est maintenant disponible sur :
# https://ayoub-services-informatique.github.io
```

### 📋 **Configuration GitHub Pages**

1. **Aller sur GitHub** : https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io
2. **Settings** → **Pages**
3. **Source** : `Deploy from a branch`
4. **Branch** : `gh-pages` 📁 `/ (root)`
5. **Save**

### 🔍 **Vérification du déploiement**

```bash
# Vérifier que le site est accessible
curl -I https://ayoub-services-informatique.github.io

# Vérifier les performances avec Lighthouse
npm run analyze
```

### 🛠️ **Résolution des problèmes**

**Problème de déploiement :**
```bash
# Nettoyer et reconstruire
npm run clean
npm run build:prod
git add dist -f
git commit -m "Fix déploiement"
git push origin main --force
git subtree push --prefix dist origin gh-pages --force
```

**CORS ou problèmes de certificats :**
```bash
# Vérifier les headers de sécurité
curl -I -H "Origin: https://ayoub-services-informatique.github.io" https://ayoub-services-informatique.github.io
```

### Serveur personnel

```bash
# Build pour la production
npm run build:prod

# Les fichiers sont dans le dossier 'dist/'
# Téléversez le contenu de 'dist/' sur votre serveur
```

### Configuration serveur

Pour un serveur Apache/Nginx, configurez :

```apache
# Apache .htaccess
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache des assets statiques
<LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</LocationMatch>
```

## 🛠️ Développement

### Ajout de nouvelles fonctionnalités

1. **Pages** : Créez le HTML dans le dossier approprié
2. **Styles** : Ajoutez les règles dans `styles.css`
3. **JavaScript** : Étendez les fonctionnalités dans `script.js` ou `api.js`
4. **Tests** : Vérifiez sur différents appareils et navigateurs

### Bonnes pratiques

- ✅ **Responsive Design** - Testez sur mobile, tablette, desktop
- ✅ **Accessibilité** - Respectez les standards WCAG
- ✅ **Performance** - Optimisez les images et le code
- ✅ **SEO** - Utilisez les balises meta appropriées
- ✅ **Sécurité** - Validez les données et évitez les failles XSS

### Outils de développement

- **ESLint** : Qualité du code JavaScript
- **HTMLHint** : Validation HTML
- **Lighthouse** : Audit des performances
- **Live Server** : Rechargement automatique

## 📊 Performance

### Optimisations incluses

- **📦 Bundling** - Fichiers optimisés pour la production
- **🗜️ Compression** - Gzip automatique
- **📱 PWA** - Fonctionnement hors ligne
- **🔍 SEO** - Métadonnées complètes
- **⚡ Cache** - Stratégies de cache avancées

### Métriques cibles

- **Performance** : > 90/100 (Lighthouse)
- **Accessibilité** : 100/100 (Lighthouse)
- **SEO** : > 95/100 (Lighthouse)
- **Taille totale** : < 500KB (gzippé)

## 🔒 Sécurité

### Mesures de sécurité

- ✅ **Content Security Policy** - Protection XSS
- ✅ **HTTPS uniquement** - Chiffrement des données
- ✅ **Validation des données** - Prévention des injections
- ✅ **Headers sécurisés** - Protection contre les attaques
- ✅ **Pas de stockage serveur** - Confidentialité des données

### RGPD

- ✅ **Consentement explicite** - Cases à cocher obligatoires
- ✅ **Données minimisées** - Collecte uniquement nécessaire
- ✅ **Durée de conservation** - Suppression automatique
- ✅ **Droits utilisateur** - Accès, rectification, suppression

## 🐛 Résolution de problèmes

### Problèmes courants

**Le serveur ne démarre pas :**
```bash
# Vérifiez le port
lsof -i :3000
# Tuez le processus si nécessaire
kill -9 PID
```

**Erreur de dépendances :**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problème de cache :**
```bash
npm run clean
npm start
```

**EmailJS ne fonctionne pas :**
- Vérifiez la configuration dans `emailjs-config.js`
- Consultez les logs de la console
- Testez la connexion internet

### Logs et debugging

```bash
# Démarrer avec plus de logs
DEBUG=* npm start

# Vérifier les erreurs JavaScript
npm run lint

# Analyser les performances
npm run analyze
```

## 📞 Support

### Contact

- **Email** : proayoubfarkh@gmail.com
- **Téléphone** : 06 29 36 98 46
- **WhatsApp** : Disponible via le site

### Ressources

- [Documentation EmailJS](./EMAILJS_SETUP.md)
- [Guide déploiement](https://pages.github.com/)
- [Standards WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

## 📋 Changelog

### Version 1.0.0
- ✅ Site web complet et fonctionnel
- ✅ Responsive design
- ✅ Intégration EmailJS préparée
- ✅ Service Worker et PWA
- ✅ Optimisations de performance
- ✅ Configuration de développement complète

## 📊 **Statistiques du projet**

<div align="center">

### 📈 **Métriques**
![Taille du repo](https://img.shields.io/github/repo-size/ayoub-services-informatique/ayoub-services-informatique.github.io?style=flat-square&logo=github)
![Dernier commit](https://img.shields.io/github/last-commit/ayoub-services-informatique/ayoub-services-informatique.github.io?style=flat-square&logo=git)
![Langages](https://img.shields.io/github/languages/top/ayoub-services-informatique/ayoub-services-informatique.github.io?style=flat-square&logo=html5)

### 🏗️ **Build Status**
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github-actions)
![Déploiement](https://img.shields.io/badge/déploiement-automatique-blue?style=flat-square&logo=github-pages)
![Performance](https://img.shields.io/badge/performance-optimisé-green?style=flat-square&logo=lighthouse)

### 📱 **Compatibilité**
![Desktop](https://img.shields.io/badge/desktop-100%25-green?style=flat-square&logo=monitor)
![Mobile](https://img.shields.io/badge/mobile-100%25-green?style=flat-square&logo=mobile)
![Accessibilité](https://img.shields.io/badge/accessibilité-WCAG%202.1-blue?style=flat-square&logo=web-accessibility)

</div>

---

## 🤝 **Contribuer**

Les contributions sont les bienvenues ! Merci de :

1. 🔧 **Fork** le projet
2. 📝 **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** la branche (`git push origin feature/AmazingFeature`)
5. 🚀 **Ouvrir** une Pull Request

### 📋 **Guidelines**
- ✅ Respecter les standards de code
- ✅ Tester sur tous les appareils
- ✅ Documenter les nouvelles fonctionnalités
- ✅ Suivre les conventions de commit

---

## 📄 **License**

**MIT License** © 2024 Ayoub - Services Informatique

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
```

<div align="center">

### 🏆 **Créé avec ❤️ par Ayoub - Services Informatique**

⭐ **Star** ce repo si vous le trouvez utile !
🐛 **Signaler** un bug : [Issues](https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io/issues)
💡 **Suggestions** : [Discussions](https://github.com/ayoub-services-informatique/ayoub-services-informatique.github.io/discussions)

</div>