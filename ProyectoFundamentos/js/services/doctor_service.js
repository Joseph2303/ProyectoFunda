const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createDoctor = async (nombre, apellidos, edad, genero, contacto, role, capture) => {
    const query = `
        mutation($input: NewDoctorInput!) {
            createDoctor(input: $input) {
                id
                nombre 
                apellidos 
                edad 
                genero 
                contacto
                role
                created_at
            }
        }      
    `;
    const input = {
        nombre,
        apellidos,
        edad,
        genero,
        contacto,
        role,
        capture
    };
    return await fetchAPI(query, input);
}

const getDoctors = async () => {
    const query = `
        query{
            doctors {
                items {                    
                    id
                    nombre 
                    apellidos 
                    edad 
                    genero 
                    contacto
                    role
                    created_at                  
                }
            }
        }
    `;
    return await fetchAPI(query, {});
};

const updateDoctor = async (id, nombre, apellidos, edad, genero, contacto, role,capture) => {
    const query = `
        mutation($input: UpdateDoctorInput!) {
            updateDoctor(input: $input) {
                id
                nombre 
                apellidos 
                edad 
                genero 
                contacto
                role
                updated_at
            }
        }
    `;
    const variables = {
        input: { id, nombre, apellidos, edad, genero, contacto, role,capture }
    };
    return await fetchAPI(query, variables);
};

const deleteDoctor = async (id) => {
    const query = `
        mutation($id: ID!) {
            deleteDoctor(id: $id) {
                id
            }
        }
    `;
    const variables = { id };
    return await fetchAPI(query, variables);
};