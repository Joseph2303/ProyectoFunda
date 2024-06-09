importScripts('https://cdnjs.cloudflare.com/ajax/libs/pouchdb/8.0.1/pouchdb.min.js')
importScripts('ProyectoFundamentos/js/sw-db.js')
const CACHE_STATIC_NAME='sw-pfw-static-v1';
const CACHE_DYNAMIC_NAME='sw-pfw-dynamic-v1';
const CACHE_INMUTABLE_NAME='sw-pfw-inmutable-v1';
const CACHE_LIMIT=200;

self.addEventListener('install',event=>{
    console.log("Service worker en instalación");
    const cacheStaticProm= caches.open(CACHE_STATIC_NAME)
        .then(cache=>{
            return cache.addAll([
                '/',
        /**         'ProyectoFundamentos/views/Admin/main.html',
                'ProyectoFundamentos/views/Admin/citasDoctor.html',
                'ProyectoFundamentos/views/Admin/citasPaciente.html',
                'ProyectoFundamentos/views/Admin/citas.html',
                'ProyectoFundamentos/views/Admin/paciente.html',
                'ProyectoFundamentos/views/Doctor/main.html',
                'ProyectoFundamentos/views/Login/login.html',
                'ProyectoFundamentos/views/Paciente/main.html',

                'ProyectoFundamentos/views/Login/login.css',
                'ProyectoFundamentos/views/Admin/Style/main.css',

                'ProyectoFundamentos/Assets/img/origin.jpg',
                'ProyectoFundamentos/Assets/img/maxresdefault.jpg',
                'ProyectoFundamentos/Assets/icon/doctor.png',
                'ProyectoFundamentos/Assets/icon/download.png',
                'ProyectoFundamentos/Assets/icon/icegif.gif',

                'ProyectoFundamentos/Scripts/Admin/main.js',
                'ProyectoFundamentos/Scripts/Doctor/main.js',
                'ProyectoFundamentos/Scripts/Login/main.js',
                'ProyectoFundamentos/Scripts/Paciente/main.js',

                'ProyectoFundamentos/views/Admin/main.js',
                'ProyectoFundamentos/js/app.js'*/
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
self.addEventListener('fetch',event=>{

});

function clearCache(cacheName,maxItems){
    caches.open(cacheName)
    .then(cache=>{
        return cache.keys()
            .then(keys=>{
                if(keys.length>maxItems){
                    cache.delete(keys[0])
                        .then(clearCache(cacheName,maxItems));
                }
            });
    });
}