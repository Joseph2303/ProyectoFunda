let url=window.location.href;
let swLoc="ProyectoFundamentos/service-worker.js";
if(navigator.serviceWorker){
    if(url.includes('localhost') || url.includes('127.0.0.1') ){
        swLoc='/service-worker.js';
    }
    navigator.serviceWorker.register(swLoc)
        .then(reg=>{
            // setTimeout(()=>{
            //     reg.sync.register('post-new-user');
            //     console.log("Se envió la información al servidor");
            // },3000);
        });
}

function notifications(){
    if(window.Notification){
        if(Notification.permission==='default'){
            Notification.requestPermission((permission)=>{
                console.log(permission)
            })
        }
    }
}

function requestNotificationPermission() {
    if (window.Notification && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso de notificación concedido');
            } else {
                console.log('Permiso de notificación denegado');
            }
        });
    }
}

function subscribeToPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BOMqtBkWm3Jrwphu4CdqpHNS648MUxdHcGS6LX8cN7EHx6qxcHLtyQV8LPhCdCNLWY8k1eDXz5BMqrwXazixfAw')
               
            }).then(subscription => {
                console.log('Suscripción exitosa a las notificaciones push:', subscription);
                sendSubscriptionToServer(subscription);
            }).catch(err => {
                console.error('Error al suscribirse a las notificaciones push:', err);
            });
        });
    }
}

 function sendSubscriptionToServer(subscription) {
    try {
        const response =  fetch('/notificacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });

        if (!response.ok) {
            throw new Error('Error al enviar la suscripción al servidor');
        }

        const data =  response.json();
        console.log('Suscripción enviada con éxito:', data);
    } catch (error) {
        console.error('Error al enviar la suscripción al servidor:', error);
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function getDatesForms(event) {
    event.preventDefault();
    const name = $('#patientName').val();
    const last_name = $('#patientLastName').val();
    const age = parseInt($('#patientAge').val());
    const cedula = $('#patientCedula').val();
    const gender = $('#patientGender').val();
    const contact = $('#patientContact').val();
    const email = $('#patientEmail').val();
    const password = $('#patientPassword').val();
    const _email = $('#email').val();
    const _password = $('#password').val();

    if (_email) {
        console.log('hola');
    } else if (email) {
        try {
            const user = await createUser(0, email, password, 'Paciente');
            await createPatient(name, last_name, age, cedula, gender, contact, user.data.createUser.id);
            console.log('Paciente y usuario creados exitosamente');
        } catch (error) {
            console.error('Error al crear usuario o paciente:', error);
        }
    }
}

window.onload=(e)=>{
    //Metodo que verifique el token
    //Si existe el token, cargamos las tareas
    //Si no exite, debemos crear un modal (sin que cierre) solicitando el inicio de sesión     
    requestNotificationPermission();
    //subscribeToPushNotifications();
    notifications()
    //llamar al metodo de subcripción
}
