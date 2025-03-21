import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) { }

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  findAll(
    @Query('specialization') specialization?: string,
    @Query('rating') rating?: number,
  ) {
    return this.matchesService.findAll({ specialization, rating });
  }
}