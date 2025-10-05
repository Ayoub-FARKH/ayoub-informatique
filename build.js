#!/usr/bin/env node

/**
 * Script de build pour optimiser le site pour la production
 * Minification, compression et optimisation des assets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Terser = require('terser');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier-terser');
const { minify } = require('html-minifier-terser');

class SiteBuilder {
  constructor() {
    this.isProduction = process.argv.includes('--production');
    this.sourceDir = __dirname;
    this.distDir = path.join(__dirname, 'dist');
    this.tempDir = path.join(__dirname, 'temp');

    console.log('🏗️  Initialisation du builder...');
    console.log(`📁 Mode: ${this.isProduction ? 'Production' : 'Développement'}`);
  }

  async build() {
    try {
      console.log('🚀 Démarrage du build...');

      // Créer les dossiers nécessaires
      this.createDirectories();

      // Nettoyer l'ancien build
      this.clean();

      // Copier les fichiers statiques
      await this.copyStaticFiles();

      // Optimiser le HTML
      await this.optimizeHTML();

      // Optimiser le CSS
      await this.optimizeCSS();

      // Optimiser le JavaScript
      await this.optimizeJavaScript();

      // Générer le service worker de production
      await this.generateServiceWorker();

      // Générer le manifest PWA
      await this.generateManifest();

      // Optimiser les images (si présentes)
      await this.optimizeImages();

      // Générer les rapports
      await this.generateReports();

      console.log('✅ Build terminé avec succès!');
      console.log(`📁 Fichiers générés dans: ${this.distDir}`);

    } catch (error) {
      console.error('❌ Erreur lors du build:', error);
      process.exit(1);
    }
  }

  createDirectories() {
    const dirs = [
      this.distDir,
      this.tempDir,
      path.join(this.distDir, 'services'),
      path.join(this.distDir, 'assets')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  clean() {
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
    this.createDirectories();
  }

  async copyStaticFiles() {
    console.log('📋 Copie des fichiers statiques...');

    const filesToCopy = [
      'index.html',
      'mentions-legales.html',
      'services/montage.html',
      'services/maintenance.html',
      'services/recuperation-donnees.html',
      'favicon.ico',
      'robots.txt',
      'sitemap.xml'
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(this.sourceDir, file);
      const destPath = path.join(this.distDir, file);

      if (fs.existsSync(srcPath)) {
        // Créer le dossier de destination si nécessaire
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(srcPath, destPath);
        console.log(`  📄 ${file}`);
      }
    }
  }

  async optimizeHTML() {
    console.log('🔧 Optimisation HTML...');

    const htmlFiles = [
      'index.html',
      'mentions-legales.html',
      'services/montage.html',
      'services/maintenance.html',
      'services/recuperation-donnees.html'
    ];

    for (const file of htmlFiles) {
      const srcPath = path.join(this.distDir, file);

      if (fs.existsSync(srcPath)) {
        const html = fs.readFileSync(srcPath, 'utf8');

        const optimizedHtml = await minify(html, {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: false,
          removeEmptyElements: false,
          removeOptionalTags: false,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: false, // On minifiera séparément
          minifyURLs: true,
          ignoreCustomComments: [/^!/], // Garder les commentaires importants
          processConditionalComments: true,
          caseSensitive: false,
          keepClosingSlash: true,
          quoteCharacter: '"'
        });

        fs.writeFileSync(srcPath, optimizedHtml);
        console.log(`  ✅ ${file}`);
      }
    }
  }

  async optimizeCSS() {
    console.log('🎨 Optimisation CSS...');

    const cssFiles = ['styles.css'];

    for (const file of cssFiles) {
      const srcPath = path.join(this.sourceDir, file);
      const destPath = path.join(this.distDir, file);

      if (fs.existsSync(srcPath)) {
        const css = fs.readFileSync(srcPath, 'utf8');

        const result = new CleanCSS({
          level: {
            1: {
              all: true,
              normalizeUrls: false
            },
            2: {
              restructureRules: true,
              mergeMedia: true,
              mergeNonAdjacentRules: true,
              mergeIntoShorthands: true,
              removeUnusedAtRules: true
            }
          },
          compatibility: {
            colors: {
              opacity: true
            },
            units: {
              ch: true,
              rem: true,
              vh: true,
              vw: true,
              vmin: true,
              vmax: true
            }
          },
          format: 'keep-breaks'
        }).minify(css);

        if (result.errors.length > 0) {
          console.warn('⚠️ Erreurs CSS:', result.errors);
        }

        fs.writeFileSync(destPath, result.styles);
        console.log(`  ✅ ${file} (${this.getSizeReduction(css, result.styles)})`);
      }
    }
  }

  async optimizeJavaScript() {
    console.log('⚡ Optimisation JavaScript...');

    const jsFiles = [
      'emailjs-config.js',
      'api.js',
      'script.js'
    ];

    for (const file of jsFiles) {
      const srcPath = path.join(this.sourceDir, file);
      const destPath = path.join(this.distDir, file);

      if (fs.existsSync(srcPath)) {
        const js = fs.readFileSync(srcPath, 'utf8');

        const result = await Terser.minify(js, {
          compress: {
            drop_console: this.isProduction,
            drop_debugger: this.isProduction,
            pure_funcs: this.isProduction ? ['console.log', 'console.info'] : []
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: !this.isProduction,
            ecma: 2018
          }
        });

        if (result.error) {
          console.error(`❌ Erreur minification ${file}:`, result.error);
          continue;
        }

        fs.writeFileSync(destPath, result.code);
        console.log(`  ✅ ${file} (${this.getSizeReduction(js, result.code)})`);
      }
    }
  }

  async generateServiceWorker() {
    console.log('🔄 Génération Service Worker...');

    const swTemplate = `/**
 * Service Worker généré automatiquement
 * Build: ${new Date().toISOString()}
 */

const CACHE_NAME = 'ayoub-services-${Date.now()}';
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/emailjs-config.js',
  '/api.js',
  '/mentions-legales.html',
  '/services/montage.html',
  '/services/maintenance.html',
  '/services/recuperation-donnees.html'
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(event.request);
        })
    );
  }
});`;

    fs.writeFileSync(path.join(this.distDir, 'sw.js'), swTemplate);
    console.log('  ✅ Service Worker généré');
  }

  async generateManifest() {
    console.log('📱 Génération Manifest PWA...');

    const manifest = {
      name: "Services Informatique - Ayoub",
      short_name: "Ayoub IT",
      description: "Services informatique professionnels: montage PC, récupération de données, maintenance",
      start_url: "/",
      display: "standalone",
      background_color: "#0b1320",
      theme_color: "#2dd4bf",
      orientation: "portrait-primary",
      categories: ["business", "utilities", "productivity"],
      lang: "fr",
      dir: "ltr",
      icons: [
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230d1b2a'/><text x='50' y='60' font-size='55' text-anchor='middle' fill='%23fff' font-family='Arial'>IT</text></svg>",
          sizes: "192x192",
          type: "image/svg+xml"
        },
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230d1b2a'/><text x='50' y='60' font-size='55' text-anchor='middle' fill='%23fff' font-family='Arial'>IT</text></svg>",
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ]
    };

    fs.writeFileSync(
      path.join(this.distDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Ajouter le lien du manifest dans le HTML
    const indexPath = path.join(this.distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf8');
      const manifestLink = '<link rel="manifest" href="manifest.json">';
      if (!html.includes('manifest.json')) {
        html = html.replace('</head>', `  ${manifestLink}\n</head>`);
        fs.writeFileSync(indexPath, html);
      }
    }

    console.log('  ✅ Manifest PWA généré');
  }

  async optimizeImages() {
    console.log('🖼️ Optimisation des images...');

    // Si vous avez des images à optimiser, ajoutez la logique ici
    // Par exemple avec sharp ou imagemin

    console.log('  ℹ️ Aucune image à optimiser');
  }

  async generateReports() {
    console.log('📊 Génération des rapports...');

    const stats = {
      buildTime: new Date().toISOString(),
      mode: this.isProduction ? 'production' : 'development',
      files: {},
      sizes: {}
    };

    // Calculer les statistiques
    const files = fs.readdirSync(this.distDir);
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(this.distDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        const size = stat.size;
        totalSize += size;
        stats.files[file] = {
          size: size,
          sizeKB: Math.round(size / 1024 * 100) / 100
        };
      }
    });

    stats.totalSize = totalSize;
    stats.totalSizeKB = Math.round(totalSize / 1024 * 100) / 100;

    fs.writeFileSync(
      path.join(this.distDir, 'build-stats.json'),
      JSON.stringify(stats, null, 2)
    );

    console.log(`  📊 Total: ${stats.totalSizeKB} KB (${files.length} fichiers)`);
  }

  getSizeReduction(original, minified) {
    const originalSize = Buffer.byteLength(original, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    return `${reduction}% réduction (${Math.round(minifiedSize / 1024)}KB)`;
  }
}

// Exécution du build
async function main() {
  const builder = new SiteBuilder();
  await builder.build();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SiteBuilder;