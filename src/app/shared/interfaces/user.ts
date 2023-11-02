import { UserRole } from "../enums/user-role";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}
