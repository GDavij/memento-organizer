export type TUpdateUserRequest = {
    email?: string,
    passphrase?: string
}

export type TLoginUserRequest = {
    email?: string,
    passphrase?: string
}

export type TSignupUserRequest = {
    email?: string,
    passphrase?: string
}

export type TCreateAdminRequest = {
    email?: string,
    passphrase?: string
    adminToken?: string
}