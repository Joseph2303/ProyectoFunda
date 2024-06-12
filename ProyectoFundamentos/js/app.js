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


const showNotification = (message) => {
    // Comprobar si las notificaciones están disponibles en el navegador
    if (!("Notification" in window)) {
        console.error("Este navegador no soporta notificaciones");
        return;
    }
    // Solicitar permiso para mostrar notificaciones si aún no se ha solicitado
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    } else {
        new Notification(message);
    }
};

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
async function updateCita(event) {

    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    let patientId = '';
    let citaId = '';
    let status = '';

    if (user.role === 'Paciente') {
        status = 'Pendiente';
        const checkbox = document.querySelector('.action-checkbox:checked');
        if (!checkbox) {
            console.error('Error: Debe seleccionar una cita');
            showNotification('Error: Debe seleccionar una cita');
            return;
        }
        citaId = checkbox.getAttribute('data-id');
        patientId = JSON.parse(localStorage.getItem('patient')).id;
    } else if (user.role === 'Doctor') {
        const btn = event.target;
        citaId = btn.dataset.id;
        console.log(btn.dataset);
        patientId = btn.dataset.patientId;

        if (!patientId) {
            console.error('Error: No se pudo obtener el ID del paciente');
            showNotification('Error: No se pudo obtener el ID del paciente');
            return;
        }
        if (btn.classList.contains("btn-aceptar")) {
            status = 'Aceptado';
        } else if (btn.classList.contains("btn-rechazar")) {
            status = 'Rechazado';
        } else {
            console.error('Error: No se pudo determinar la acción (aceptar/rechazar)');
            showNotification('Error: No se pudo determinar la acción (aceptar/rechazar)');
            return;
        }
    } else {
        console.error('Error: Rol de usuario no válido');
        showNotification('Error: Rol de usuario no válido');
        return;
    }

    try {
        const updated = await updateAppointment(citaId, patientId, status);
        if (updated) {
            showNotification(`Cita actualizada a ${status}`);
            cargarTabla();
        } else {
            showNotification("Error al actualizar la cita");
        }
    } catch (error) {
        console.error('Error :', error);
        showNotification(`Error al actualizar cita: ${error.message}`);
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

async function addDoctor(event) {
    event.preventDefault();
    const name = $('#doctorName').val();
    const last_name = $('#doctorLastName').val();
    const age = parseInt($('#doctorAge').val());
    const gender = $('#doctorGender').val();
    const contact = $('#doctorContact').val();
    const cedula = $('#doctorCedula').val();
    const email = $('#doctorEmail').val();
    const password = $('#doctorPassword').val();
    try {
        const user = await createUser(0, email, password, 'Doctor');
        await createDoctor(name, last_name, age, cedula, gender, contact, user.data.createUser.id);
        cargarTabla();
    } catch (error) {
        console.error('Error al crear el doctor:', error);
    }
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

const getDataFromCache = async (url) => {
    const CACHE_DYNAMIC_NAME = 'sw-pfw-dynamic-v1'; // Definir el nombre del caché aquí
    const cache = await caches.open(CACHE_DYNAMIC_NAME);
    const response = await cache.match(url);
    console.log(response);
    if (!response) return null;
    return response.json();
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
            if (operation.type === 'updateAppointment') {
                const { id, patientId, status } = operation.payload;
                await updateAppointment(id, patientId, status);
            }else if (operation.type === 'createUser') {
                const { id, email, password, role } = operation.payload;
                await createUser(id, email, password, role);
            }
        }
        console.log('Operaciones pendientes sincronizadas con éxito');
    } catch (error) {
        console.error('Error al sincronizar operaciones pendientes:', error);
    }
};

window.addEventListener('online', async () => {
    await syncPendingOperations();
});

