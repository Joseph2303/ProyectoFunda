
document.getElementById('CitasDoctor').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
    logout();
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/ProyectoFundamentos/views/Login/login.html'; 
}
