const CACHE_NAME = 'stok-selis-v17';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useAuth.ts',
  '/hooks/useStock.ts',
  '/hooks/useTransactions.ts',
  '/utils/dateUtils.ts',
  '/components/AddNewItemModal.tsx',
  '/components/AddStockModal.tsx',
  '/components/BottomNav.tsx',
  '/components/Dashboard.tsx',
  '/components/EditItemModal.tsx',
  '/components/FilterControls.tsx',
  '/components/Header.tsx',
  '/components/Login.tsx',
  '/components/LowStockWarning.tsx',
  '/components/RecentTransactions.tsx',
  '/components/RecordOutgoingModal.tsx',
  '/components/Spinner.tsx',
  '/components/StockItemCard.tsx',
  '/components/StockList.tsx',
  '/components/UserManagement.tsx',
  '/components/icons/ArrowDownIcon.tsx',
  '/components/icons/ArrowUpIcon.tsx',
  '/components/icons/ChartBarIcon.tsx',
  '/components/icons/ExclamationTriangleIcon.tsx',
  '/components/icons/ListBulletIcon.tsx',
  '/components/icons/LogoutIcon.tsx',
  '/components/icons/MinusIcon.tsx',
  '/components/icons/PackageIcon.tsx',
  '/components/icons/PencilIcon.tsx',
  '/components/icons/PlusIcon.tsx',
  '/components/icons/SyncIcon.tsx',
  '/components/icons/UsersIcon.tsx',
  'https://esm.sh/react@19.2.0',
  'https://esm.sh/react@19.2.0/jsx-runtime',
  'https://esm.sh/react-dom@19.2.0/client',
  'https://esm.sh/scheduler',
  'https://makassarwebsite.com/wp-content/uploads/2025/10/android-launchericon-512-512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching URLs');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to open cache or add URLs during install:', err);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }

            // We don't cache POST requests from the Apps Script API
            if(event.request.url.includes('script.google.com')) {
                return response;
            }

            // Clone the response because it's a stream and we want to cache it.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
            console.error('Fetch failed:', err);
            // Optional: return a fallback page for navigation requests if offline
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        });
      })
  );
});

// Update a service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});