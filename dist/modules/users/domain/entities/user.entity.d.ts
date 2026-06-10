export declare class UserEntity {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, name: string, email: string, password: string, createdAt: Date, updatedAt: Date);
}
