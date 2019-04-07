import { Role } from "./role";

export class User {
    idUser: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    idBoss?: number;
    role: Role;
    token?: string;
}