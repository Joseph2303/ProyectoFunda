function mostrarMensajeDeInfo(mensaje) {
    const nuevoContenedor = document.createElement('div');
    nuevoContenedor.classList.add('mensaje-container', 'mensaje-info', 'slide-in');
    nuevoContenedor.innerHTML = `
        <div class="icon-container">
            <i class="fas fa-info-circle"></i>
        </div>
        <div class="mensaje">${mensaje}</div>`;
    document.body.appendChild(nuevoContenedor);

    setTimeout(function () {
        nuevoContenedor.classList.remove('slide-in');
        nuevoContenedor.classList.add('slide-out');
        setTimeout(function () {
            nuevoContenedor.remove();
        }, 500); // Tiempo de espera para que termine la animación de salida
    }, 5000); // 5000 milisegundos = 5 segundos
}

function mostrarMensajeDeError(mensaje) {
    const nuevoContenedor = document.createElement('div');
    nuevoContenedor.classList.add('mensaje-container', 'mensaje-error', 'slide-in');
    nuevoContenedor.innerHTML = `
        <div class="icon-container">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="mensaje">${mensaje}</div>`;
    document.body.appendChild(nuevoContenedor);

    setTimeout(function () {
        nuevoContenedor.classList.remove('slide-in');
        nuevoContenedor.classList.add('slide-out');
        setTimeout(function () {
            nuevoContenedor.remove();
        }, 500); // Tiempo de espera para que termine la animación de salida
    }, 5000); // 5000 milisegundos = 5 segundos
}
