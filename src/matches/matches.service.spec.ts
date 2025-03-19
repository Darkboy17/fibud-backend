import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: PrismaService,
          useValue: {
            match: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a match', async () => {
      const createMatchDto: CreateMatchDto = { expertId: '1', clientId: '2' };
      const expectedMatch = { id: '123', expertId: '1', clientId: '2', createdAt: new Date() };

      jest.spyOn(prisma.match, 'create').mockResolvedValue(expectedMatch);

      const result = await service.create(createMatchDto);
      expect(result).toEqual(expectedMatch);
      expect(prisma.match.create).toHaveBeenCalledWith({
        data: { expertId: '1', clientId: '2' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all matches without filters', async () => {
      const expectedMatches = [
        { id: '1', expertId: '1', clientId: '2', createdAt: new Date(), expert: { id: '1' }, client: { id: '2' } },
      ];

      jest.spyOn(prisma.match, 'findMany').mockResolvedValue(expectedMatches);

      const result = await service.findAll();
      expect(result).toEqual(expectedMatches);
      expect(prisma.match.findMany).toHaveBeenCalledWith({
        include: { expert: true, client: true },
        where: { expert: undefined },
      });
    });

    it('should return matches filtered by specialization', async () => {
      const expectedMatches = [
        { id: '1', expertId: '1', clientId: '2', createdAt: new Date(), expert: { id: '1', specialization: 'AI' }, client: { id: '2' } },
      ];

      jest.spyOn(prisma.match, 'findMany').mockResolvedValue(expectedMatches);

      const result = await service.findAll({ specialization: 'AI' });
      expect(result).toEqual(expectedMatches);
      expect(prisma.match.findMany).toHaveBeenCalledWith({
        include: { expert: true, client: true },
        where: { expert: { specialization: 'AI' } },
      });
    });
  });
});
