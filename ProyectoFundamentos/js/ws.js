const wsAPI = 'ws://localhost:9000/graphql';

const newUserSubscription = () => {
    const websocket = new WebSocket(wsAPI, 'graphql-transport-ws');

    websocket.onerror = (err) => {
        console.log(err);
    };

    websocket.onopen = () => {
        console.log('Conectando a la suscripción de nuevos usuarios');
        const accessToken = localStorage.getItem('accessToken');
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
            const role = localStorage.getItem('userRole');
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
            }
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

newUserSubscription();
