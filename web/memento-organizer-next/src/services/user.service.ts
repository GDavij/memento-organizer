import axios from '@/lib/axios.setup'
import { User } from '@/models/data/user';
import { TLoginUserRequest, TSignupUserRequest, TUpdateUserRequest } from '@/models/requests/userRequests';



async function checkIsAdmin(): Promise<boolean> {
    return (await axios.get("/users/isAdmin")).data;
}


async function deleteTargetUser(id: string): Promise<boolean> {
    return (await axios.delete(`/users/delete/${id}`)).data;
}

async function deleteUser(): Promise<boolean> {
    return (await axios.delete("/users/delete")).data;
}

async function findUser(): Promise<User> {
    return (await axios.get("/users/find")).data;
}

async function listAllAdmins(): Promise<User[]> {
    return (await axios.get("/users/list/admins")).data;
}

async function listAllUsers(): Promise<User[]> {
    return (await axios.get("/users/list")).data;
}

async function loginUser(login: TLoginUserRequest): Promise<string> {
    return (await axios.post<{ token: string }>("/users/login", login)).data.token;
}

async function signUpUser(enrollment: TSignupUserRequest): Promise<void> {
    return await axios.post("/users/new", enrollment);
}

async function updateTargetUser(userId: string, update: TUpdateUserRequest): Promise<void> {
    return await axios.put(`/users/update/${userId}`, update);
}

async function updateUser(update: TUpdateUserRequest): Promise<string> {
    return (await axios.put<{ token: string }>("/users/update/", update)).data.token;
}

const service = {
    checkIsAdmin,
    deleteTargetUser,
    deleteUser,
    findUser,
    listAllAdmins,
    listAllUsers,
    loginUser,
    signUpUser,
    updateTargetUser,
    updateUser
}
export default service;