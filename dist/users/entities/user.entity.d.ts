export declare enum UserRole {
    PLAYER = "PLAYER",
    OWNER = "OWNER",
    ADMIN = "ADMIN"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
    role: UserRole;
    createdAt: Date;
}
