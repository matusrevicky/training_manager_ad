import { Role } from "./role";

export class User {
    idUser?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    idBoss?: number;
    role?: number;
    token?: string;

    cn: string;
    displayName: string;
    employeeID: string;
    givenName: string;
    name: string;
    sn: string;
    userAccountControl: number;
    distinguishedName: string;
    manager: string;
    extensionAttribute1 : number;
}