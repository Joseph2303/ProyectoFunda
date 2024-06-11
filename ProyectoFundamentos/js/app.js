let url = window.location.href;
let swLoc = "ProyectoFundamentos/service-worker.js";
if (navigator.serviceWorker) {
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        swLoc = '/service-worker.js';
    }
    navigator.serviceWorker.register(swLoc)
        .then(reg => {
            // setTimeout(()=>{
            //     reg.sync.register('post-new-user');
            //     console.log("Se envió la información al servidor");
            // },3000);
        });
}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registrado con éxito:', registration);

        window.addEventListener('online', () => {
            registration.sync.register('sync-pending-operations')
                .then(() => {
                    console.log('Sincronización en segundo plano registrada');
                })
                .catch(err => {
                    console.error('Error al registrar la sincronización en segundo plano:', err);
                });
        });
    }).catch(err => {
        console.error('Error al registrar el Service Worker:', err);
    });
}


function notifications() {
    if (window.Notification) {
        if (Notification.permission === 'default') {
            Notification.requestPermission((permission) => {
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
        const response = fetch('/notificacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });

        if (!response.ok) {
            throw new Error('Error al enviar la suscripción al servidor');
        }

        const data = response.json();
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

window.onload = (e) => {
    //Metodo que verifique el token
    //Si existe el token, cargamos las tareas
    //Si no exite, debemos crear un modal (sin que cierre) solicitando el inicio de sesión     
    requestNotificationPermission();
    //subscribeToPushNotifications();
    notifications()
    //llamar al metodo de subcripción
}

///////////////////////////////////////////////////////////////////////////
//login
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
    console.log(_email)
    console.log(email)
    if (_email) {
        try {
            login(_email, _password);
        } catch (error) {
            console.error('Error al iniciar sesion:', error);
        }
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

///////////////////////
//paciente

async function updateCita(event){
    event.preventDefault();
    const patientId = JSON.parse(localStorage.getItem('patient')).id;
    const checkbox = document.querySelector('.action-checkbox:checked');
    const id = checkbox.getAttribute('data-id');

    try {

        const updated = await updateAppointment(id, patientId, 'Pendiente');
        if (updated) {
            alert("Cita actualizada a Pendiente");
            cargarTabla();
            document.getElementById("myModal").style.display = "none";
        } else {
            alert("Error al actualizar la cita");
        }

    } catch (error) {
        console.error('Error :', error);
    }


}

///////////////////
//cita
async function getDoctores() {
    const doctorSelect = document.getElementById('doctor-select');

    try {
        const limit = 20; // Define el límite deseado
        const doctors = await getDoctors(limit);
        console.log(doctors)
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `Nombre: ${doctor.name} ${doctor.last_name}, Cedula: ${doctor.cedula}`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al crear la cita:', error);
    }
}

///////////////
//admin

function acceptAppointment(event) {
    event.preventDefault();
    const name = $('#appointmentName').val();
    const date = $('#appointmentDate').val();
    const hour = $('#appointmentTime').val();
    const doctor = $('#doctor-select').val();
    console.log(hour)
    try {
        createAppointment(name, date, hour, "Disponible", doctor);
        cargarTabla();
    } catch (error) {
        console.error('Error al crear la cita:', error);
    }
}

function actPatient(event){
    event.preventDefault();
    const name = $('#patientName').val();
    const last_name = $('#patientLastName').val();
    const age = parseInt($('#patientAge').val());
    const cedula = $('#patientCedula').val();
    const gender = $('#patientGender').val();
    const contact = $('#patientContact').val();
    const email = $('#patientEmail').val();
    const password = $('#patientPassword').val();
}
// local storage
const saveDataToCache = async (url, data) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_DATA',
            url: url,
            data: data
        });
    }
};

const getCachedData = async (url) => {
    const cachedData = localStorage.getItem(url);
    return cachedData ? JSON.parse(cachedData) : null;
};
const savePendingOperation = async (operation) => {
    try {
        let pendingOperations = JSON.parse(localStorage.getItem('pendingOperations')) || [];
        pendingOperations.push(operation);
        localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
    } catch (error) {
        console.error('Error al guardar la operación pendiente:', error);
        throw error;
    }
};
// Función para obtener y eliminar operaciones pendientes de localStorage
const getAndClearPendingOperations = () => {
    const pendingOperations = JSON.parse(localStorage.getItem('pendingOperations')) || [];
    localStorage.removeItem('pendingOperations');
    console.log(pendingOperations);
    return pendingOperations;
};
const syncPendingOperations = async () => {
    try {
        const operations = getAndClearPendingOperations();
        console.log('Operaciones pendientes:', operations); // Agregar este console.log para ver las operaciones pendientes
        for (const operation of operations) {
            if (operation.type === 'createUser') {
                const { id, email, password, role } = operation.payload;
                await createUser(id, email, password, role);
            }
            // Agrega más lógica aquí para otros tipos de operaciones si es necesario
        }
        console.log('Operaciones pendientes sincronizadas con éxito');
    } catch (error) {
        console.error('Error al sincronizar operaciones pendientes:', error);
    }
};

window.addEventListener('online', async () => {
    await syncPendingOperations();
});
