import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) { }

  async create(createMatchDto: CreateMatchDto) {
    return this.prisma.match.create({
      data: {
        expertId: createMatchDto.expertId,
        clientId: createMatchDto.clientId,
      },
    });
  }

  async findAll(filter?: { specialization?: string; rating?: number | string }) {
    try {
      // Convert the rating filter to a number if it's provided
      const ratingFilter = filter?.rating ? Number(filter.rating) : undefined;
  
      return await this.prisma.match.findMany({
        include: {
          expert: true,
          client: true,
        },
        where: {
          expert: filter?.specialization || ratingFilter ? {
            specialization: filter?.specialization,
            rating: ratingFilter,
          } : undefined,
        },
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw new Error('Failed to fetch matches');
    }
  }
}