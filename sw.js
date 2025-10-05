/**
 * Service Worker pour la gestion des requêtes backend
 * Permet le fonctionnement hors ligne et l'envoi d'emails
 */
const CACHE_NAME = 'ayoub-services-v1';
const API_CACHE = 'api-cache-v1';

// Ressources à mettre en cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/emailjs-config.js',
  '/mentions-legales.html',
  '/services/montage.html',
  '/services/maintenance.html',
  '/services/recuperation-donnees.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Installation du Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Mise en cache des ressources statiques...');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker installé');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Activation du Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Gestion des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stratégie de cache pour les ressources statiques
  if (request.method === 'GET' && (
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  )) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              // Ne pas mettre en cache les erreurs
              if (!response.ok) {
                return response;
              }

              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });

              return response;
            })
            .catch(() => {
              // Fallback pour les pages HTML en cas de perte de connexion
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }
            });
        })
    );
  }

  // Gestion des requêtes API (pour EmailJS)
  if (url.pathname.startsWith('/api/') || url.hostname.includes('emailjs')) {
    event.respondWith(
      caches.open(API_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache les réponses API réussies
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Essaie de récupérer depuis le cache en cas d'échec réseau
              return cache.match(request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    console.log('📡 Réponse API depuis le cache');
                    return cachedResponse;
                  }

                  // Retourne une réponse d'erreur si rien en cache
                  return new Response(
                    JSON.stringify({
                      success: false,
                      error: 'Hors ligne - Veuillez réessayer plus tard',
                      offline: true
                    }),
                    {
                      status: 503,
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );
                });
            });
        })
    );
  }
});

// Gestion des messages depuis la page principale
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION',
        data: { version: CACHE_NAME }
      });
      break;

    case 'CLEAR_CACHE':
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
        .then(() => {
          event.ports[0].postMessage({
            type: 'CACHE_CLEARED',
            data: { success: true }
          });
        });
      break;

    case 'SAVE_FORM_DATA':
      // Sauvegarder temporairement les données du formulaire
      caches.open('form-data')
        .then((cache) => {
          const request = new Request('/temp-form-data');
          const response = new Response(JSON.stringify(data));
          cache.put(request, response);
        });
      break;

    default:
      console.log('📨 Message non reconnu:', type);
  }
});

// Gestion des notifications push (pour futures fonctionnalités)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Voir le message',
          icon: '/icon-explore.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icon-close.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Fonction utilitaire pour vérifier la connexion
async function isOnline() {
  try {
    // Essaie de récupérer une ressource externe légère
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isOnline };
}