const Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI = "http://localhost:9000/graphql"

const createAdmin = async (name, deadline, capture) => {
    const query = `
        mutation($input: NewAdminInput!) {
            createAdmin(input: $input) {
            id
            name
            deadline
            created_at
            }
        }      
    `;
    const input = {
        name,
        deadline,
        capture
    };
    return await fetchAPI(query, input);
}

const getAdmins = async (limit) => {
    const query = `
        query{
            admins {
                items {                    
                                      
                }
            }
        }
    `;
    const input = {
        limit
    };
    return await fetchAPI(query, input);
};

const updateAdmin = async (id, name, deadline, capture) => {
    const query = `
        mutation($input: UpdateAdminInput!) {
            updateAdmin(input: $input) {
                id
                name
                deadline
                updated_at
            }
        }
    `;
    const variables = {
        input: { id, name, deadline, capture }
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