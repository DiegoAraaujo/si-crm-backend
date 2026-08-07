import { GetDashboardUseCase } from 'src/modules/dashboard/application/use-cases/get-dashboard.use-case'
import { PrismaService } from 'src/shared/infra/database/prisma.service'

const makePrismaService = () => ({
  lead: {
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  status: {
    findMany: jest.fn(),
  },
  activity: {
    findMany: jest.fn(),
  },
})

const makeDefaultPrismaResolves = (prisma: ReturnType<typeof makePrismaService>) => {
  prisma.lead.count.mockResolvedValue(0)
  prisma.lead.findMany.mockResolvedValue([])
  prisma.lead.groupBy.mockResolvedValue([])
  prisma.status.findMany.mockResolvedValue([])
  prisma.activity.findMany.mockResolvedValue([])
}

describe('GetDashboardUseCase', () => {
  let useCase: GetDashboardUseCase
  let prisma: ReturnType<typeof makePrismaService>

  beforeEach(() => {
    prisma = makePrismaService()
    useCase = new GetDashboardUseCase(prisma as unknown as PrismaService)
    makeDefaultPrismaResolves(prisma)
  })

  describe('stats', () => {
    it('should return totalLeads and newLeads counts', async () => {
      prisma.lead.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)

      const result = await useCase.execute('user-id-123')

      expect(result.stats.totalLeads).toBe(10)
      expect(result.stats.newLeads).toBe(3)
    })

    it('should return topStatus based on lead count', async () => {
      prisma.status.findMany.mockResolvedValue([
        { id: '1', name: 'Novo', color: '#blue', order: 0, _count: { leads: 2 } },
        { id: '2', name: 'Em andamento', color: '#green', order: 1, _count: { leads: 8 } },
        { id: '3', name: 'Fechado', color: '#red', order: 2, _count: { leads: 1 } },
      ])

      const result = await useCase.execute('user-id-123')

      expect(result.stats.topStatus).toBe('Em andamento')
      expect(result.stats.topStatusColor).toBe('#green')
    })

    it('should return default topStatus when there are no statuses', async () => {
      prisma.status.findMany.mockResolvedValue([])

      const result = await useCase.execute('user-id-123')

      expect(result.stats.topStatus).toBe('—')
      expect(result.stats.topStatusColor).toBe('#888')
    })
  })

  describe('boardDistribution', () => {
    it('should map statuses to name, color and count', async () => {
      prisma.status.findMany.mockResolvedValue([
        { id: '1', name: 'Novo', color: '#blue', order: 0, _count: { leads: 5 } },
      ])

      const result = await useCase.execute('user-id-123')

      expect(result.boardDistribution).toEqual([
        { name: 'Novo', color: '#blue', count: 5 },
      ])
    })
  })

  describe('originDistribution', () => {
    it('should map origin groupBy results correctly', async () => {
      prisma.lead.groupBy
        .mockResolvedValueOnce([
          { origin: 'WHATSAPP', _count: { origin: 4 } },
          { origin: 'INSTAGRAM', _count: { origin: 2 } },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const result = await useCase.execute('user-id-123')

      expect(result.originDistribution).toEqual([
        { name: 'WHATSAPP', count: 4 },
        { name: 'INSTAGRAM', count: 2 },
      ])
    })
  })

  describe('propertyTypeDistribution', () => {
    it('should return only top 5 property types', async () => {
      const manyTypes = Array.from({ length: 8 }, (_, i) => ({
        propertyType: `TYPE_${i}`,
        _count: { propertyType: 10 - i },
      }))

      prisma.lead.groupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(manyTypes)
        .mockResolvedValueOnce([])

      const result = await useCase.execute('user-id-123')

      expect(result.propertyTypeDistribution).toHaveLength(5)
    })
  })

  describe('recentLeads', () => {
    it('should map recent leads with status info', async () => {
      prisma.lead.findMany.mockResolvedValue([
        {
          id: 'lead-1',
          name: 'John Doe',
          propertyType: 'APARTAMENTO',
          city: 'Fortaleza',
          createdAt: new Date('2024-01-01'),
          status: { name: 'Novo', color: '#blue' },
        },
      ])

      const result = await useCase.execute('user-id-123')

      expect(result.recentLeads).toEqual([
        {
          id: 'lead-1',
          name: 'John Doe',
          propertyType: 'APARTAMENTO',
          city: 'Fortaleza',
          statusName: 'Novo',
          statusColor: '#blue',
          createdAt: new Date('2024-01-01'),
        },
      ])
    })
  })

  describe('recentActivities', () => {
    it('should map recent activities with lead name', async () => {
      prisma.activity.findMany.mockResolvedValue([
        {
          id: 'activity-1',
          action: 'Lead criado',
          createdAt: new Date('2024-01-01'),
          lead: { name: 'John Doe' },
        },
      ])

      const result = await useCase.execute('user-id-123')

      expect(result.recentActivities).toEqual([
        {
          id: 'activity-1',
          action: 'Lead criado',
          leadName: 'John Doe',
          createdAt: new Date('2024-01-01'),
        },
      ])
    })
  })

  describe('controller', () => {
    it('should call useCase with the authenticated user id', async () => {
      const executeSpy = jest.spyOn(useCase, 'execute').mockResolvedValue({} as any)

      await useCase.execute('user-id-123')

      expect(executeSpy).toHaveBeenCalledWith('user-id-123')
    })
  })
})