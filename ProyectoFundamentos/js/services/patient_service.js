const Authorization="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQXN4ZXFzZXJmc2QiLCJlbWFpbCI6ImVkZGllckB1bmEuY3IiLCJuYW1lIjoiRWRkaWVyIiwiaWF0IjoxNzE3NjMwNTc4fQ.m_G6IiX7knD9hppJ5yVpP8KN6ggMoKY4_s3hnmL4CFU";
const urlAPI="http://localhost:9000/graphql"

const createPatiente=async (name,deadline,capture)=>{
    const query=`
        mutation($input: NewTaskInput!) {
            createTask(input: $input) {
            id
            name
            deadline
            created_at
            }
        }      
    `;
    const input={
        name,
        deadline,
        capture
    };
    return await fetchAPI(query,input);
}