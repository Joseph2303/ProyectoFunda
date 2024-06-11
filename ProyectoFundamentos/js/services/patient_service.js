const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createPatient = async (nombre, apellidos, genero, edad, cedula, contacto, userId) => {
    const query = `
        mutation($input: NewPatientInput!) {
            createPatient(input: $input) {
                id
                nombre
                apellidos
                genero
                edad
                cedula
                contacto
                user {
                    id
                    email
                    role
                }
                citas {
                    id
                    fecha
                    motivo
                }
            }
        }
    `;
    const input = {
        nombre,
        apellidos,
        genero,
        edad,
        cedula,
        contacto,
        userId
    };
    return await fetchAPI(query, { input });
};

const getPatients = async () => {
    const query = `
        query {
            patients {
                items {
                    id
                    nombre
                    apellidos
                    genero
                    edad
                    cedula
                    contacto
                    user {
                        id
                        email
                        role
                    }
                    citas {
                        id
                        fecha
                        motivo
                    }
                }
            }
        }
    `;
    return await fetchAPI(query, {});
};

const updatePatient = async (id, nombre, apellidos, genero, edad, cedula, contacto, userId) => {
    const query = `
        mutation($input: UpdatePatientInput!) {
            updatePatient(input: $input) {
                id
                nombre
                apellidos
                genero
                edad
                cedula
                contacto
                user {
                    id
                    email
                    role
                }
            }
        }
    `;
    const input = {
        id,
        nombre,
        apellidos,
        genero,
        edad,
        cedula,
        contacto,
        userId
    };
    return await fetchAPI(query, { input });
};

const deletePatient = async (id) => {
    const query = `
        mutation($id: ID!) {
            deletePatient(id: $id) {
                id
            }
        }
    `;
    const variables = { id };
    return await fetchAPI(query, variables);
};

const fetchAPI = async (query, variables) => {
    const response = await fetch(urlAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Authorization
        },
        body: JSON.stringify({ query, variables })
    });
    const data = await response.json();
    return data.data;
};

//////////////////////////////
//citas
const getAppointment = async (limit) => {
    const query = `
        query {
            citas {
                items {                    
                    id
                    name 
                    date
                    hour
                    status
                    doctor {
                     id
                     name
                     last_name
                     cedula
                    }
                }
            }
        }
    `;
    const input = {
        limit
    };
    const response = await fetchAPI(query, input);
    console.log(response)
    return response.citas.items;
};

const updateAppointment = async (id, patientId, status) => {
    const query = `
        mutation UpdateCita($input: CitaInput!) {
            updateCita(input: $input) {
                id
                name
            }
        }
    `;
    const variables = {
        input: {id, patientId, status }
    };
    return await fetchAPI(query, variables);
};