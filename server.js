#!/usr/bin/env node

/**
 * Serveur de développement ultra-simple pour Services Informatique Ayoub
 * Version minimale qui fonctionne sans dépendances externes
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Types MIME pour différents fichiers
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Création du serveur HTTP simple
const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;

  // Route par défaut
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Sécuriser les chemins (pas de directory traversal)
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  // Vérifier que le fichier existe
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Fichier non trouvé');
    return;
  }

  // Obtenir les statistiques du fichier
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erreur serveur');
      return;
    }

    // Vérifier si c'est un fichier
    if (!stats.isFile()) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Accès refusé');
      return;
    }

    // Obtenir l'extension du fichier
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Headers de sécurité de base
    const headers = {
      'Content-Type': mimeType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };

    // Ajouter les headers CORS pour le développement
    if (req.headers.origin) {
      headers['Access-Control-Allow-Origin'] = '*';
      headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    res.writeHead(200, headers);

    // Créer un stream de lecture
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Gestion des erreurs de stream
    fileStream.on('error', (error) => {
      console.error('Erreur de lecture fichier:', error);
      res.end();
    });
  });
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} déjà utilisé`);
    console.log(`💡 Essayez: npm run serve (port différent)`);
  } else {
    console.error('❌ Erreur serveur:', error);
  }
});

// Démarrage du serveur
server.listen(PORT, HOST, () => {
  console.log('\n🚀 Serveur de développement démarré!');
  console.log(`📁 Site: http://${HOST}:${PORT}`);
  console.log(`📂 Dossier: ${__dirname}`);
  console.log(`⚡ Prêt pour le développement!\n`);

  console.log('📋 Commandes disponibles:');
  console.log(`  Modifier les fichiers -> Rechargement automatique`);
  console.log(`  Ouvrir http://${HOST}:${PORT} dans votre navigateur`);
  console.log(`  Ctrl+C pour arrêter le serveur\n`);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n📴 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n📴 Signal d\'arrêt reçu...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});

console.log('🔧 Initialisation du serveur...');