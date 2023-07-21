import axios from '@/lib/axios.setup'
import { User } from '@/models/data/user';
import { TLoginUserRequest, TSignupUserRequest, TUpdateUserRequest } from '@/models/requests/userRequests';



async function checkIsAdmin(): Promise<boolean> {
    return (await axios.get("/users/isAdmin")).data;
}


async function deleteUser(token: string): Promise<boolean> {
    return (await axios.delete(`/users/delete/${token}`)).data;
}

async function findUser(): Promise<User> {
    return (await axios.get("/users/find")).data;
}

async function loginUser(login: TLoginUserRequest): Promise<string> {
    return (await axios.post<{ token: string }>("/users/login", login)).data.token;
}

async function signUpUser(enrollment: TSignupUserRequest): Promise<void> {
    return await axios.post("/users/new", enrollment);
}

async function updateUser(userId: string, update: TUpdateUserRequest): Promise<string> {
    return (await axios.put<{ token: string }>(`/users/update/${userId}`, update)).data.token;
}

const service = {
    checkIsAdmin,
    deleteUser,
    findUser,
    loginUser,
    signUpUser,
    updateUser
}
export default service;