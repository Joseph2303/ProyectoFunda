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

const getDoctors = async (limit) => {
    try {
        const query = `
            query {
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
        const input = { limit };
        const response = await fetchAPI(query, {});

        if (!response || !response.doctors || !response.doctors.items) {
            console.error('Estructura de la respuesta inválida:', response);
            throw new Error('Datos inválidos de la respuesta de la API');
        }

        saveDataToCache(urlAPI + "/getDoctors", response); // Guardar los datos en caché
        return response.doctors.items;
    } catch (error) {
        console.error('Error al obtener los doctores desde internet:', error);

        // Intentar obtener los datos del caché
        try {
            const cachedData = await getCachedData(urlAPI + "/getDoctors");
            if (cachedData && cachedData.doctors && cachedData.doctors.items) {
                console.log("Datos obtenidos del caché:", cachedData);
                return cachedData.doctors.items;
            } else {
                console.error('No se encontraron datos en caché:', cachedData);
                throw new Error('No se encontraron datos en caché');
            }
        } catch (cacheError) {
            console.error('Error al obtener los doctores desde caché:', cacheError);
            throw cacheError;
        }
    }
};


const updateDoctor = async (id, nombre, apellidos, edad, genero, contacto, role, capture) => {
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
        input: { id, nombre, apellidos, edad, genero, contacto, role, capture }
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


//////////////////////////////////
//citas

const getAppointmentByDoctor = async (doctorId) => {
    const query = `
        query CitasByDoctor($doctorId: ID!) {
            citasByDoctor(doctorId: $doctorId) {
                               
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
                patient {
                     id
                     name
                     last_name
                     cedula
                }
                
            }
        }
    `;
    const variables  = {
        doctorId
    };
    const response = await fetchAPI2(query, variables );
    console.log(response)
    return response.data.citasByDoctor;
};

const updateAppointment = async (id,  patientId, status) => {
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
    console.log(variables)
    return await fetchAPI(query, variables);
};

const fetchAPI2 = async (query, variables ) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization
        },
        body: JSON.stringify({
            query,
            variables       
        })
    };
    try {
        const result = await fetch(urlAPI, options);
        const data = await result.json();
        if (data.errors) {
            cargarTabla();
            throw new Error(data.errors[0].message);
        }
        return data;
    } catch (error) {
        console.error('Error en la solicitud GraphQL:', error);
        throw new Error('Error en la solicitud GraphQL. Por favor, inténtalo de nuevo más tarde.');
    }
}