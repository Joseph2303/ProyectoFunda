importScripts('https://cdnjs.cloudflare.com/ajax/libs/pouchdb/8.0.1/pouchdb.min.js')
importScripts('js/sw-db.js')
const CACHE_STATIC_NAME='sw-una-task-static-v1';
const CACHE_DYNAMIC_NAME='sw-una-task-dynamic-v1';
const CACHE_INMUTABLE_NAME='sw-una-task-inmutable-v1';
const CACHE_LIMIT=200;

self.addEventListener('install',event=>{
    console.log("Service worker en instalación");
    const cacheStaticProm= caches.open(CACHE_STATIC_NAME)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/views/Admin/main.html',
                '/views/Admin/citasDoctor.html',
                '/views/Admin/citasPaciente.html',
                '/views/Admin/citas.html',
                '/views/Admin/paciente.html',
                '/views/Doctor/main.html',
                '/views/Login/login.html',
                '/views/Paciente/main.html',

                '/views/Login/login.css',
                '/views/Admin/Style/main.css',

                '/Assets/img/origin.jpg',
                '/Assets/img/maxresdefault.jpg',
                '/Assets/icon/doctor.png',
                '/Assets/icon/download.png',
                '/Assets/icon/icegif.gif',

                '/views/Admin/main.js',
                '/js/app.js'
            ]);
        });
    const cacheInmutableProm=caches.open(CACHE_INMUTABLE_NAME)
        .then(cache=>cache.addAll([
            'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/8.0.1/pouchdb.min.js'
        ]));
    event.waitUntil(Promise.all([
        cacheStaticProm,
        cacheInmutableProm
    ]));
});
self.addEventListener('activate',event=>{
    console.log("Service worker activo 2");
});
self.addEventListener('sync',event=>{
    console.log("Online.....")
    if(event.tag==='new-mutation'){
        event.waitUntil(syncOnline())
    }
});