#!/usr/bin/env node

/**
 * Script de sauvegarde automatique du projet
 * Crée des archives avec horodatage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BackupManager {
  constructor() {
    this.projectRoot = __dirname;
    this.backupDir = path.join(this.projectRoot, 'backups');
    this.maxBackups = 10;
  }

  async createBackup() {
    try {
      console.log('📦 Création d\'une sauvegarde...');

      // Créer le dossier de sauvegarde
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }

      // Nom de la sauvegarde avec horodatage
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}`;
      const backupPath = path.join(this.backupDir, backupName);

      // Créer le dossier de sauvegarde
      fs.mkdirSync(backupPath, { recursive: true });

      // Fichiers à sauvegarder (exclure node_modules, dist, etc.)
      const filesToBackup = [
        'index.html',
        'mentions-legales.html',
        'services/',
        'styles.css',
        'script.js',
        'api.js',
        'emailjs-config.js',
        'sw.js',
        'package.json',
        'README.md',
        'EMAILJS_SETUP.md',
        '.eslintrc.js',
        '.htmlhintrc',
        'server.js',
        'build.js'
      ];

      console.log('📋 Copie des fichiers...');

      // Copier les fichiers
      for (const file of filesToBackup) {
        const srcPath = path.join(this.projectRoot, file);
        const destPath = path.join(backupPath, file);

        if (fs.existsSync(srcPath)) {
          if (fs.statSync(srcPath).isDirectory()) {
            // Copier récursivement les dossiers
            this.copyDirectory(srcPath, destPath);
          } else {
            // Créer le dossier de destination si nécessaire
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }

      // Créer une archive ZIP
      console.log('🗜️ Création de l\'archive ZIP...');
      const zipPath = path.join(this.backupDir, `${backupName}.zip`);

      // Utiliser le zip de Git si disponible, sinon créer une archive simple
      try {
        process.chdir(this.backupDir);
        execSync(`zip -r "${backupName}.zip" "${backupName}"`);
        process.chdir(this.projectRoot);

        // Supprimer le dossier temporaire
        fs.rmSync(backupPath, { recursive: true, force: true });

        console.log(`✅ Sauvegarde créée: ${zipPath}`);

        // Nettoyer les anciennes sauvegardes
        this.cleanupOldBackups();

        return zipPath;

      } catch (error) {
        console.log('⚠️ ZIP non disponible, création d\'une archive TAR...');
        process.chdir(this.backupDir);
        execSync(`tar -czf "${backupName}.tar.gz" "${backupName}"`);
        process.chdir(this.projectRoot);

        // Supprimer le dossier temporaire
        fs.rmSync(backupPath, { recursive: true, force: true });

        const tarPath = path.join(this.backupDir, `${backupName}.tar.gz`);
        console.log(`✅ Sauvegarde créée: ${tarPath}`);

        // Nettoyer les anciennes sauvegardes
        this.cleanupOldBackups();

        return tarPath;
      }

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-') && (file.endsWith('.zip') || file.endsWith('.tar.gz')))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      // Garder seulement les N dernières sauvegardes
      if (files.length > this.maxBackups) {
        const filesToDelete = files.slice(this.maxBackups);

        filesToDelete.forEach(file => {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Suppression ancienne sauvegarde: ${file.name}`);
        });
      }

    } catch (error) {
      console.error('Erreur nettoyage sauvegardes:', error);
    }
  }

  listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-') && (file.endsWith('.zip') || file.endsWith('.tar.gz')))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: this.formatBytes(stats.size),
            date: stats.mtime.toISOString(),
            sizeBytes: stats.size
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log('\n📦 Sauvegardes disponibles:');
      console.log('═'.repeat(60));

      if (files.length === 0) {
        console.log('Aucune sauvegarde trouvée');
      } else {
        files.forEach((file, index) => {
          console.log(`${index + 1}. ${file.name}`);
          console.log(`   📅 ${file.date.split('T')[0]} | 📏 ${file.size}`);
        });
      }

      console.log('═'.repeat(60));
      return files;

    } catch (error) {
      console.error('Erreur liste sauvegardes:', error);
      return [];
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Exécution
async function main() {
  const backupManager = new BackupManager();

  const command = process.argv[2] || 'create';

  switch (command) {
    case 'create':
      await backupManager.createBackup();
      break;

    case 'list':
      backupManager.listBackups();
      break;

    case 'cleanup':
      backupManager.cleanupOldBackups();
      console.log('✅ Nettoyage terminé');
      break;

    default:
      console.log('Usage: node backup.js [create|list|cleanup]');
      console.log('  create : Créer une nouvelle sauvegarde');
      console.log('  list   : Lister les sauvegardes existantes');
      console.log('  cleanup: Nettoyer les anciennes sauvegardes');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = BackupManager;