const wsAPI = 'ws://localhost:9000/graphql';
const publicKey = "BIT7HNcZEyg9kpIw9KH6IS-7PN6ASriTKTeA2sFq7Gmh8yvh9YiSSmafK7P5MWo7nABg1dgSZ9WGVpmWO8bRk_o";
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";

const newUserSubscription = () => {
    const websocket = new WebSocket(wsAPI, 'graphql-transport-ws');

    websocket.onerror = (err) => {
        console.log(err);
    };

    websocket.onopen = () => {
        console.log('Conectando a la suscripción de nuevos usuarios');
        const message = JSON.stringify({
            type: 'connection_init',
            payload: {
                accessToken
            }
        });
        websocket.send(message);
    };

    websocket.onclose = (e) => {
        console.log("Conexión con ws cerrada");
    };

    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === 'connection_ack') {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('userRole');  // se toman datos del local storage, deberia funcionar con lo del loguin 
            let subscriptionQuery = '';
            if (role === 'admin') {
                subscriptionQuery = `
                    nuevoUsuario(chatID: "${userId}") {
                        type
                        payload {
                            id
                            email
                            role
                            password
                            pushEndpoint
                            receiveNotifications
                        }
                    }
                `;
            } else if (role === 'user') {
                subscriptionQuery = `
                    nuevoUsuario(chatID: "${userId}") {
                        type
                        payload {
                            id
                            email
                            role
                            password
                            pushEndpoint
                            receiveNotifications
                        }
                    }
                `;
            } // falta lo de doctor y ver que se notificara al usuario
            const msg = JSON.stringify({
                id: '1',
                type: 'subscribe',
                payload: {
                    query: `subscription {
                        ${subscriptionQuery}
                    }`
                }
            });
            websocket.send(msg);
        } else if (data.type === 'next') {
            const { payload } = data.payload;
            new Notification('Nuevo usuario creado', {
                body: 'Email: ' + payload.email + ', Rol: ' + payload.role
            });
            console.log(data.payload.data);
        }
    };
};

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker interceptando fetch', event.request);
});

self.addEventListener('push', (event) => {
    console.log('Service Worker recibiendo push', event);
});

newUserSubscription();

