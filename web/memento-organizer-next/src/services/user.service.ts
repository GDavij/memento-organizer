import axios from '@/lib/axios.setup'
import { User } from '@/models/data/user';
import { TLoginUserRequest, TUpdateUserRequest } from '@/models/requests/userRequests';



async function checkIsAdmin(): Promise<boolean> {
    return (await axios.get("/users/isAdmin")).data;
}

async function findUser(): Promise<User> {
    return (await axios.get("/users/find")).data;
}

async function loginUser(login: TLoginUserRequest): Promise<string> {
    return (await axios.post<{ token: string }>("/users/login", login)).data.token;
}

async function updateUser(userId: string, update: TUpdateUserRequest): Promise<boolean> {
    return (await axios.put(`/users/update/${userId}`, update)).data
}

const service = {
    checkIsAdmin,
    findUser,
    loginUser,
    updateUser
}
export default service;