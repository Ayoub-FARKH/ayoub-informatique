# 🚀 Démarrage Rapide - Services Informatique Ayoub

## ✅ Installation et Démarrage

### 1. Installation (Déjà faite)
```bash
npm install
```

### 2. Démarrage du serveur
```bash
npm start
```

### 3. Accéder au site
Ouvrez votre navigateur et allez sur : **http://localhost:3000**

---

## 🎯 Ce qui fonctionne déjà

### ✅ **Serveur de développement**
- Site accessible sur http://localhost:3000
- Rechargement automatique lors des modifications
- Support de tous les fichiers (HTML, CSS, JS, images)

### ✅ **Fonctionnalités du site**
- Navigation responsive avec menu burger
- Formulaire de contact fonctionnel
- Design moderne et professionnel
- Compatible tous navigateurs et appareils

### ✅ **Backend intégré**
- Gestion automatique des formulaires
- Système de fallback mailto
- Préparation pour EmailJS
- Gestion des brouillons automatique

---

## 📧 Configuration EmailJS (Optionnel)

Pour activer l'envoi d'emails automatique :

1. **Créez un compte** sur [https://www.emailjs.com/](https://www.emailjs.com/)

2. **Configurez un service email** (Gmail, Outlook, etc.)

3. **Créez un template d'email** avec ces variables :
   ```
   {{nom}} {{prenom}}
   {{email}}
   {{telephone}}
   {{prestation}}
   {{objet}}
   {{message}}
   ```

4. **Modifiez `emailjs-config.js`** :
   ```javascript
   SERVICE_ID: 'votre_vrai_service_id',
   TEMPLATE_ID: 'votre_vrai_template_id',
   PUBLIC_KEY: 'votre_vraie_cle_publique'
   ```

5. **Activez EmailJS dans `api.js`** :
   ```javascript
   enableEmailJS: true
   ```

---

## 🛠️ Commandes utiles

```bash
# Serveur de développement
npm start          # Démarrer le serveur (port 3000)
npm run dev        # Mode développement
npm run serve      # Serveur de production local

# Build et déploiement
npm run build      # Construire le site
npm run backup     # Créer une sauvegarde

# Utilitaires
npm run clean      # Nettoyer les fichiers temporaires
npm run security   # Vérifier la sécurité
```

---

## 📁 Structure du projet

```
📦 code-main/
├── 📄 index.html              # Page d'accueil
├── 📄 styles.css              # Styles du site
├── 📄 script.js               # JavaScript
├── 📄 server.js               # Serveur de développement
├── 📄 package.json            # Configuration npm
├── 📁 services/               # Pages des services
│   ├── montage.html
│   ├── maintenance.html
│   └── recuperation-donnees.html
├── 📁 backups/                # Sauvegardes automatiques
└── 📄 README.md               # Documentation complète
```

---

## 🌐 Développement

### Modifications en temps réel
1. Modifiez n'importe quel fichier (HTML, CSS, JS)
2. Sauvegardez le fichier
3. Le navigateur se recharge automatiquement
4. Vos changements sont visibles instantanément

### Test du formulaire
1. Allez sur http://localhost:3000
2. Cliquez sur "Contact"
3. Remplissez le formulaire
4. Cliquez sur "Envoyer"
5. Votre client email s'ouvre avec le message pré-rempli

---

## 🚀 Prochaines étapes

### Immédiatement
- ✅ **Serveur fonctionne** - Vous pouvez développer
- ✅ **Site accessible** - Testez toutes les fonctionnalités
- ✅ **Modifications temps réel** - Développement fluide

### Bientôt (optionnel)
- 🔄 **Configurer EmailJS** pour envoi d'emails automatique
- 📦 **Build de production** avec `npm run build`
- 🚀 **Déploiement** avec `npm run deploy`

---

## 🆘 Support

Si vous avez des problèmes :

1. **Le serveur ne démarre pas ?**
   ```bash
   # Vérifiez si le port 3000 est libre
   netstat -ano | findstr :3000
   # Tuez le processus si nécessaire
   taskkill /PID <PID> /F
   ```

2. **Erreurs JavaScript ?**
   - Ouvrez la console du navigateur (F12)
   - Vérifiez les erreurs en rouge

3. **Problèmes de fichiers ?**
   ```bash
   # Nettoyer et réinstaller
   npm run clean
   npm install
   ```

---

## 🎉 Prêt à développer !

Votre environnement de développement est maintenant **100% fonctionnel** !

- ✅ Serveur démarré avec succès
- ✅ Site accessible sur http://localhost:3000
- ✅ Toutes les fonctionnalités opérationnelles
- ✅ Développement en temps réel activé

**Bon développement !** 🚀