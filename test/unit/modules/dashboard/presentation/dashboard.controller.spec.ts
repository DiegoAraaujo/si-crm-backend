import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from 'src/modules/dashboard/presentation/dashboard.controller';
import { GetDashboardUseCase } from 'src/modules/dashboard/application/use-cases/get-dashboard.use-case';
import { Request } from 'express';

const makeRequest = (userId = 'user-id-123'): Partial<Request> => ({
  user: { id: userId },
});

const makeDashboardOutput = () => ({
  stats: {
    totalLeads: 10,
    newLeads: 3,
    topStatus: 'Novo',
    topStatusColor: '#blue',
  },
  boardDistribution: [],
  originDistribution: [],
  propertyTypeDistribution: [],
  typeDistribution: [],
  recentLeads: [],
  recentActivities: [],
});

describe('DashboardController', () => {
  let controller: DashboardController;
  let getDashboardUseCase: jest.Mocked<GetDashboardUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: GetDashboardUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    getDashboardUseCase = module.get(GetDashboardUseCase);
  });

  it('should call GetDashboardUseCase with the authenticated user id', async () => {
    getDashboardUseCase.execute.mockResolvedValue(makeDashboardOutput());

    await controller.getDashboard(makeRequest() as Request);

    expect(getDashboardUseCase.execute).toHaveBeenCalledWith('user-id-123');
  });

  it('should return the output from GetDashboardUseCase', async () => {
    const output = makeDashboardOutput();
    getDashboardUseCase.execute.mockResolvedValue(output);

    const result = await controller.getDashboard(makeRequest() as Request);

    expect(result).toEqual(output);
  });
});
