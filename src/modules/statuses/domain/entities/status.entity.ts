export class StatusEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly color: string,
    readonly order: number,
    readonly isDefault: boolean,
    readonly userId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
