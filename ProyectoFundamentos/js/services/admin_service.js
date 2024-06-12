const token = localStorage.getItem('token');

if (token) {
  const Authorization = `Bearer ${token}`;
  console.log(Authorization); // You can now use this token in your API calls
} else {
  console.log('Token not found in local storage');
}
const urlAPI = "http://localhost:9000/graphql"

const createAdmin = async (nombre, apellidos, edad, genero, contacto, role, capture) => {
    const query = `
        mutation($input: NewAdminInput!) {
            createAdmin(input: $input) {
                id
                name, 
                apellidos, 
                edad, 
                genero, 
                contacto, 
                role,
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

const getAdmins = async (limit) => {
    try {
        const query = `
            query {
                admins {
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
        const response = await fetchAPI(query, input);

        if (!response || !response.admins || !response.admins.items) {
            console.error('Estructura de la respuesta inválida:', response);
            throw new Error('Datos inválidos de la respuesta de la API');
        }

        saveDataToCache(urlAPI + "/getAdmins", response); // Guardar los datos en caché
        return response.admins.items;
    } catch (error) {
        console.error('Error al obtener los administradores desde internet:', error);

        // Intentar obtener los datos del caché
        try {
            const cachedData = await getCachedData(urlAPI + "/getAdmins");
            if (cachedData && cachedData.admins && cachedData.admins.items) {
                console.log("Datos obtenidos del caché:", cachedData);
                return cachedData.admins.items;
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
            mostrarMensajeDeError('Error, verifique sus datos')
            throw new Error(data.errors[0].message);
        }
        return data;
    } catch (error) {
        console.error('Error en la solicitud GraphQL:', error);
        throw new Error('Error en la solicitud GraphQL. Por favor, inténtalo de nuevo más tarde.');
    }
}

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

/////////////////
//patient

const deletePatient = async (deletePatientId) => {
    const query = `
        mutation DeletePatient($deletePatientId: ID!) {
            deletePatient(id: $deletePatientId) {
             id   
            }
        }
    `;
    const variables = { deletePatientId };
    return await fetchAPIdelete(query, variables);
};


const getPatients = async (limit) => {
    const query = `
        query {
            patients {
                items {
                    id
                    name
                    last_name
                    age
                    gender
                    contact
                    cedula
                    user {
                        email
                        role
                    }
                    citas {
                        date
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
    return response.data.patients.items;
};

////////////////////////////////
//doctor
const createDoctor = async (name, last_name, age, cedula, gender, contact, userId) => {
    const query = `
        mutation($input: NewDoctorInput!) {
            createDoctor(input: $input) {
                id
                name
            }
        }      
    `;
    const input = {
        name, last_name, age, cedula, gender, contact,userId
    };
    return await fetchAPI(query, input);
}

const getDoctors = async (limit) => {
    const query = `
        query{
            doctors {
                items {                    
                    id
                    name 
                    last_name
                    age
                    gender
                    contact
                    cedula
                    user{
                        email
                    }
                }
            }
        }
    `;
    const input = {
        limit
    };
    const response = await fetchAPI(query, input);
    return response.data.doctors.items;
};

const deletedDoctor = async (deleteDoctorId) => {
    const query = `
            mutation DeleteDoctor($deleteDoctorId: ID!) {
                deleteDoctor(id: $deleteDoctorId) {
             id   
            }
        }
    `;
    const variables = { deleteDoctorId };
    return await fetchAPIdelete(query, variables);
};

////////////////////////////////
//cita

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
                    patient {
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
    return response.data.citas.items;
};

///////////////
//user

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
        throw error;
    }
}