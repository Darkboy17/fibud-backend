import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpertsModule } from './experts/experts.module';
import { ClientsModule } from './clients/clients.module';
import { MatchesModule } from './matches/matches.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ExpertsModule, ClientsModule, MatchesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
