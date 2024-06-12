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
    try{
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
    if (!response || !response.data || !response.data.citasByDoctor) {
        console.error('Estructura de la respuesta inválida:', response);
        throw new Error('Datos inválidos de la respuesta de la API');
    }

    saveDataToCache(urlAPI + "/getCitasByDoctor", response); 
    console.log("funciona");
    return response.data.citasByDoctor;
    }catch (error) {
        console.error('Error al obtener las citas desde internet:', error);

        // Intentar obtener los datos del caché
        try {
            const cachedData = await getDataFromCache(urlAPI + "/getCitasByDoctor");
            if (cachedData && cachedData.data && cachedData.data.citasByDoctor) {
                console.log("Datos obtenidos del caché:", cachedData);
                return cachedData.data.citasByDoctor;
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
        id, patientId, status 
    };
    try {
        if (navigator.onLine) {
            return await fetchAPI(query, variables);
        } else {
            const operation = { type: 'updateAppointment', payload: { id, patientId, status } };
            await savePendingOperation(operation);
            const message = `Operación pendiente guardada. Se realizará cuando haya conexión. Datos: ${JSON.stringify(operation)}`;
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(message);
            } else if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        new Notification(message);
                    }
                });
            } else {
                console.error('Las notificaciones no están permitidas.');
            }
    
            throw new Error('No hay conexión a Internet. La operación se realizará cuando haya conexión.');
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
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