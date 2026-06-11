export class LeadEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string | null,
    readonly phone: string | null,
    readonly type: string,
    readonly propertyType: string,
    readonly city: string | null,
    readonly neighborhood: string | null,
    readonly budgetMin: number | null,
    readonly budgetMax: number | null,
    readonly origin: string,
    readonly notes: string | null,
    readonly userId: string,
    readonly statusId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
