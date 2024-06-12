function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('patient');
    localStorage.removeItem('user');
    window.location.href = '/ProyectoFundamentos/views/Login/login.html'; 
}

// Event listener para el icono de "Cerrar Sesión"
document.getElementById('logoutIcon').addEventListener('click', function() {
    logout();
});
