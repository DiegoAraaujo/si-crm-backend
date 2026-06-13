export class RefreshTokenEntity {
  constructor(
    readonly id: string,
    readonly tokenHash: string,
    readonly userId: string,
    readonly expiresAt: Date,
    readonly revoked: boolean,
    readonly createdAt: Date,
  ) {}
}