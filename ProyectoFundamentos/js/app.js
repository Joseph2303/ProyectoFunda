let url=window.location.href;
let swLoc="unatask/service-worker.js";
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
const modalContainer=document.getElementById("modal-container")
const addBtn=document.getElementById("add-task-button")

addBtn.addEventListener("click",()=>{
    createModal(`
        <div class="container mt-5">
            <h2 class="mb-4">Nueva tarea</h2>
            <form id="new-task-form">
                <div class="mb-3">
                    <label for="nombre-tarea" class="form-label">Nombre de la tarea</label>
                    <input type="text" class="form-control" id="nombre-tarea" name="nombre-tarea" required/>
                </div>
                <div class="mb-3">
                    <label for="fecha-finalizacion" class="form-label">Fecha de finalización</label>
                    <input type="date" class="form-control" id="fecha-finalizacion" name="fecha-finalizacion" required/>
                </div>
                <div class="mb-3">
                    <label for="imagen" class="form-label">Captura de imagen</label>
                    <input type="file" class="form-control" id="imagen" name="imagen"/>
                </div>

                <button type="submit" id="btn-save" class="btn btn-primary" >Guardar</button>
            </form>
        </div>
    `)
})

const createModal=(content="")=>{
    modalContainer.innerHTML=`
        <div class="modal" id="modal">
            <div class="modal-content modal-transform">
                ${content}
                <button id="btn-close-modal" class="modal-btn-closed">x</button>
            </div>
        </div>
    `;
    const deleteModal=()=>{
        modalContainer.innerHTML=""
    }
    document.getElementById("modal").addEventListener("click",(e)=>{
        if(e.target.id==="btn-close-modal"){
            deleteModal()
        }
    })
    const form=document.getElementById("new-task-form");
    form.addEventListener("submit",saveTask);
    
    function saveTask(event){
        event.preventDefault();
        const data=new FormData(event.target);
        const name=data.get("nombre-tarea");
        const deadline=data.get("fecha-finalizacion");
        const capture=null;
        console.log(name);
        createTask(name,deadline,capture);
        deleteModal();
        alert("Tarea creada")
    }
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

window.onload=(e)=>{
    //Metodo que verifique el token
    //Si existe el token, cargamos las tareas
    //Si no exite, debemos crear un modal (sin que cierre) solicitando el inicio de sesión     
    console.log(getTasks());
    requestNotificationPermission();
    subscribeToPushNotifications();
    notifications()
    //llamar al metodo de subcripción
    newTaskSubscription()

}
