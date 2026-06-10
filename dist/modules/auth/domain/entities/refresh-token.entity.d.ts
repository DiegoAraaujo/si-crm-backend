export declare class RefreshTokenEntity {
    readonly id: string;
    readonly tokenHash: string;
    readonly userId: string;
    readonly expiresAt: Date;
    readonly revoked: boolean;
    readonly createdAt: Date;
    constructor(id: string, tokenHash: string, userId: string, expiresAt: Date, revoked: boolean, createdAt: Date);
}
