import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma, Task } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() data: Prisma.TaskCreateInput): Promise<Task> {
    try {
      return this.tasksService.createTask(data);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Usuario não pode ser criado',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }

  @Get()
  async findAll(): Promise<Task[]> {
    try {
      return await this.tasksService.getTasks();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Nenhum usuario encontrado',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: e,
        },
      );
    }
  }
  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    try {
      return await this.tasksService.updateTask({ where: { id }, data });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Usuario não pode ser atualizado',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    try {
      return this.tasksService.deleteTask({ id });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Usuario não pode ser deletado',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }
}
