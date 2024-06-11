const CACHE_STATIC_NAME = 'sw-pfw-static-v1';
const CACHE_DYNAMIC_NAME = 'sw-pfw-dynamic-v1';
const CACHE_INMUTABLE_NAME = 'sw-pfw-inmutable-v1';
const CACHE_LIMIT = 200;

const urlsToCache = [
    '/',
    //administrador
    '/ProyectoFundamentos/views/Admin/citas.html',
    '/ProyectoFundamentos/views/Admin/citasDoctor.html',
    '/ProyectoFundamentos/views/Admin/Style/main.css',
    '/ProyectoFundamentos/views/Admin/citaspaciente.html',
    '/ProyectoFundamentos/views/Admin/doctor.html',
    '/ProyectoFundamentos/views/Admin/main.html',
    '/ProyectoFundamentos/views/Admin/paciente.html',
    '/ProyectoFundamentos/views/Admin/main.js',
    //Paciente
    '/ProyectoFundamentos/views/Paciente/main.html',
    '/ProyectoFundamentos/views/Paciente/pacienteMain.css',
    //Doctor
    '/ProyectoFundamentos/views/Doctor/doctorMain.css',
    '/ProyectoFundamentos/views/Doctor/main.html',
    //login
    '/ProyectoFundamentos/views/Login/login.css',
    '/ProyectoFundamentos/views/Login/login.html',
    // logout
    '/ProyectoFundamentos/views/logout.js',
    //services
    '/ProyectoFundamentos/js/services/admin_service.js',
    '/ProyectoFundamentos/js/services/appointment_service.js',
    '/ProyectoFundamentos/js/services/auth.js',
    '/ProyectoFundamentos/js/services/doctor_service.js',
    '/ProyectoFundamentos/js/services/patient_service.js',
    '/ProyectoFundamentos/js/services/user_service.js',
    '/ProyectoFundamentos/js/app.js',
    '/ProyectoFundamentos/js/jquery.js',
    '/ProyectoFundamentos/js/router.js',
    '/ProyectoFundamentos/js/sw-db.js',
    '/ProyectoFundamentos/Scripts/Login/login.js',
    //imagenes e iconos
    '/ProyectoFundamentos/Assets/img/origin.jpg',
    '/ProyectoFundamentos/Assets/img/maxresdefault.jpg',
    '/ProyectoFundamentos/Assets/icon/doctor.png',
    '/ProyectoFundamentos/Assets/icon/download.png',
    '/ProyectoFundamentos/Assets/icon/icegif-939.gif',
];

// Limitar el tamaño del caché
function clearCache(cacheName, maxItems) {
    caches.open(cacheName).then(cache => {
        return cache.keys().then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(clearCache(cacheName, maxItems));
            }
        });
    });
}

self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    const cacheStaticProm = caches.open(CACHE_STATIC_NAME).then(cache => {
        console.log('Cache estático abierto');
        return cache.addAll(urlsToCache);
    });

    const cacheInmutableProm = caches.open(CACHE_INMUTABLE_NAME).then(cache => {
        return cache.addAll([
            'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/8.0.1/pouchdb.min.js'
        ]);
    });

    event.waitUntil(Promise.all([cacheStaticProm, cacheInmutableProm]));
});

self.addEventListener('activate', event => {
    console.log('Service Worker activado');
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }

            const fetchRequest = event.request.clone();

            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();

                    caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                        clearCache(CACHE_DYNAMIC_NAME, CACHE_LIMIT);
                    });

                    return response;
                })
                .catch(error => {
                    console.error('Fetch failed; returning offline page instead.', error);
                    return caches.match('/offline.html');
                });
        })
    );
});

self.addEventListener('push', event => {
    console.log('Service Worker recibiendo push', event);
});