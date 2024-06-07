const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createAdmin = async (email, password, capture) => {
    const query = `
        mutation($input: NewAdminInput!) {
            createAdmin(input: $input) {
                id
                email 
                password
                created_at
            }
        }      
    `;
    const input = {
        email,
        password,
        capture
    };
    return await fetchAPI(query, input);
}

const getAdmins = async (limit) => {
    const query = `
        query{
            users {
                items {
                    id                    
                    email                  
                }
            }
        }
    `;
    const input = {
        limit
    };
    return await fetchAPI(query, input);
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