let token;

async function login(){
    const email = $('email').val();
    const password = $('email').val();
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Token:', data.token);
        localStorage.setItem('token', data.token);
       setToken(data.token)
    } else {
        console.error('Login failed', response.status);
    }
}

function setToken(dataToken) {
     token = dataToken;
}

function getToken() {
    return token;
}