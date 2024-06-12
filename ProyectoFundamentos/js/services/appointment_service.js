const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createAppointment = async (name, date, hour, status, doctorId, patientId) => {
    const query = `
        mutation($input: NewCitaInput!) {
            createCita(input: $input) {
                id
                name, 
                created_at
            }
        }      
    `;
    const input = {
        name, date, hour, status, doctorId, patientId
    };
    return await fetchAPI(query, input);
}

const getAppointment = async (limit) => {
    try {
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
        const input = { limit };
        const response = await fetchAPI(query, {});

        if (!response || !response.citas || !response.citas.items) {
            console.error('Estructura de la respuesta inválida:', response);
            throw new Error('Datos inválidos de la respuesta de la API');
        }

        saveDataToCache(urlAPI + "/getCitas", response); // Guardar los datos en caché
        return response.citas.items;
    } catch (error) {
        console.error('Error al obtener las citas desde internet:', error);

        // Intentar obtener los datos del caché
        try {
            const cachedData = await getCachedData(urlAPI + "/getCitas");
            if (cachedData && cachedData.citas && cachedData.citas.items) {
                console.log("Datos obtenidos del caché:", cachedData);
                return cachedData.citas.items;
            } else {
                console.error('No se encontraron datos en caché:', cachedData);
                throw new Error('No se encontraron datos en caché');
            }
        } catch (cacheError) {
            console.error('Error al obtener las citas desde caché:', cacheError);
            throw cacheError;
        }
    }
};

const updateAdmin = async (id, nombre, apellidos, edad, genero, contacto, role, capture) => {
    const query = `
        mutation($input: UpdateAdminInput!) {
            updateAdmin(input: $input) {
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

const deleteAppointment = async (deleteCitaId) => {
    const query = `
        mutation($deleteCitaId: ID!) {
            deleteCita(id: $deleteCitaId) {
             id   
            }
        }
    `;
    const variables = { deleteCitaId };
    return await fetchAPIdelete(query, variables);
};

const fetchAPIdelete = async (query, variables ) => {
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