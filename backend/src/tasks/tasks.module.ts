import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma.service';
import { TasksController } from './tasks.controller';
@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
