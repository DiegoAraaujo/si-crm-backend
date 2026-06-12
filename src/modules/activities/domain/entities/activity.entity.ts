export class ActivityEntity {
  constructor(
    readonly id: string,
    readonly action: string,
    readonly leadId: string,
    readonly userId: string,
    readonly createdAt: Date,
  ) {}
}
