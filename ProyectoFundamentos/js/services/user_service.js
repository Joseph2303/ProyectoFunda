const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createUser = async (id, email, password, role) => {
    const query = `
        mutation($input: NewUserInput!) {
            createUser(input: $input) {
                id
                email 
                role
                created_at
            }
        }      
    `;
    const input = {
        id,
        email,
        password,
        role,
    };
    try {
        return await fetchAPI(query, input);
    } catch (error) {
        console.error('Error al crear asuario:', error);
        // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario o realizando alguna acción adicional
        throw error; // Lanza el error para que pueda ser manejado por la parte que llama a esta función, si es necesario
    }
}

const getAdmins = async (limit) => {
    try {
        const query = `
            query {
                users {
                    items {
                        id
                        email
                    }
                }
            }
        `;
        const input = { limit };
        const response = await fetchAPI(query, input);

        if (!response || !response.users || !response.users.items) {
            console.error('Estructura de la respuesta inválida:', response);
            throw new Error('Datos inválidos de la respuesta de la API');
        }

        saveDataToCache(urlAPI + "/getAdmins", response); // Guardar los datos en caché
        return response.users.items;
    } catch (error) {
        console.error('Error al obtener los administradores desde internet:', error);

        // Intentar obtener los datos del caché
        try {
            const cachedData = await getCachedData(urlAPI + "/getAdmins");
            if (cachedData && cachedData.users && cachedData.users.items) {
                console.log("Datos obtenidos del caché:", cachedData);
                return cachedData.users.items;
            } else {
                console.error('No se encontraron datos en caché:', cachedData);
                throw new Error('No se encontraron datos en caché');
            }
        } catch (cacheError) {
            console.error('Error al obtener los administradores desde caché:', cacheError);
            throw cacheError;
        }
    }
};

const updateAdmin = async (id, email, password, capture) => {
    const query = `
        mutation($input: UpdateAdminInput!) {
            updateAdmin(input: $input) {
                id
                email 
                password
                updated_at
            }
        }
    `;
    const variables = {
        input: { id, email, password, capture }
    };
    return await fetchAPI(query, variables);
};

const deleteAdmin = async (id) => {
    const query = `
        mutation($id: ID!) {
            deleteAdmin(id: $id) {
                id
            }
        }
    `;
    const variables = { id };
    return await fetchAPI(query, variables);
};

const fetchAPI = async (query, input) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization
        },
        body: JSON.stringify({
            query,
            variables: {
                input
            }
        })
    };
    try {
        const result = await fetch(urlAPI, options);
        const data = await result.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }
        return data;
    } catch (error) {
        console.error('Error en la solicitud GraphQL:', error);
        throw new Error('Error en la solicitud GraphQL. Por favor, inténtalo de nuevo más tarde.');
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////

const createPatient = async (name, last_name, age, cedula, gender, contact, userId) => {
    const query = `
        mutation($input: NewPatientInput!) {
            createPatient(input: $input) {
                id
                name
                created_at
            }
        }      
    `;
    const input = {
        name, 
        last_name, 
        age, 
        cedula, 
        gender, 
        contact,
        userId
    };
    console.log(input)
    try {
        return await fetchAPI(query, input);
    } catch (error) {
        console.error('Error al crear paciente:', error);
        throw error;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:9000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login fallido');
        }

        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token); 
        localStorage.setItem('user', JSON.stringify(data.user) );
        if (data.user.role === 'Paciente') {
            localStorage.setItem('patient', JSON.stringify(data.patientInfo));
        } else if (data.user.role === 'Doctor') {
            localStorage.setItem('doctor', JSON.stringify(data.doctorInfo));
        } 
        console.log('Login exitoso', token);
        console.log('Datos del usuario:', data.user.role);
        if(data.user.role == 'Paciente'){
            window.location.href = '/ProyectoFundamentos/views/Paciente/main.html'
        }else if(data.user.role == 'Doctor'){
            window.location.href = '/ProyectoFundamentos/views/Doctor/main.html'
        }else{
            window.location.href = '/ProyectoFundamentos/views/Admin/main.html'
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
}