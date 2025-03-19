import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';

describe('MatchesController', () => {
  let controller: MatchesController;
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [MatchesService, PrismaService],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /matches', () => {
    it('should create a match with valid expertId and clientId', async () => {
      const createMatchDto: CreateMatchDto = {
        expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
        clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
      };

      const result = {
        id: '65f8e1b1e4b0a1a2b3c4d5e8',
        expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
        clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createMatchDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createMatchDto);
    });

    it('should throw an error if expertId is missing', async () => {
      const createMatchDto = {
        clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
      } as CreateMatchDto;

      await expect(controller.create(createMatchDto)).rejects.toThrow();
    });

    it('should throw an error if clientId is missing', async () => {
      const createMatchDto = {
        expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
      } as CreateMatchDto;

      await expect(controller.create(createMatchDto)).rejects.toThrow();
    });

    it('should throw an error if expertId is invalid', async () => {
      const createMatchDto: CreateMatchDto = {
        expertId: 'invalid-id',
        clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
      };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Invalid expertId'));

      await expect(controller.create(createMatchDto)).rejects.toThrow('Invalid expertId');
    });

    it('should throw an error if clientId is invalid', async () => {
      const createMatchDto: CreateMatchDto = {
        expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
        clientId: 'invalid-id',
      };

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Invalid clientId'));

      await expect(controller.create(createMatchDto)).rejects.toThrow('Invalid clientId');
    });
  });

  describe('GET /matches', () => {
    it('should return all matches', async () => {
      const result = [
        {
          id: '65f8e1b1e4b0a1a2b3c4d5e8',
          expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
          clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
          createdAt: new Date(),
          expert: {
            id: '65f8e1b1e4b0a1a2b3c4d5e6',
            name: 'John Doe',
            specialization: 'Software',
            availability: 'Full-time',
            rating: 4.5,
          },
          client: {
            id: '65f8e1b1e4b0a1a2b3c4d5e7',
            name: 'Client A',
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return matches filtered by specialization', async () => {
      const result = [
        {
          id: '65f8e1b1e4b0a1a2b3c4d5e8',
          expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
          clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
          createdAt: new Date(),
          expert: {
            id: '65f8e1b1e4b0a1a2b3c4d5e6',
            name: 'John Doe',
            specialization: 'Software',
            availability: 'Full-time',
            rating: 4.5,
          },
          client: {
            id: '65f8e1b1e4b0a1a2b3c4d5e7',
            name: 'Client A',
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll('Software', undefined)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({ specialization: 'Software' });
    });

    it('should return matches filtered by rating', async () => {
      const result = [
        {
          id: '65f8e1b1e4b0a1a2b3c4d5e8',
          expertId: '65f8e1b1e4b0a1a2b3c4d5e6',
          clientId: '65f8e1b1e4b0a1a2b3c4d5e7',
          createdAt: new Date(),
          expert: {
            id: '65f8e1b1e4b0a1a2b3c4d5e6',
            name: 'John Doe',
            specialization: 'Software',
            availability: 'Full-time',
            rating: 4.5,
          },
          client: {
            id: '65f8e1b1e4b0a1a2b3c4d5e7',
            name: 'Client A',
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(undefined, 4.5)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({ rating: 4.5 });
    });

    it('should return an empty array if no matches are found', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      expect(await controller.findAll('NonExistentSpecialization', 5.0)).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith({
        specialization: 'NonExistentSpecialization',
        rating: 5.0,
      });
    });
  });
});