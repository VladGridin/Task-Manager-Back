import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { UserController } from './task.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [TaskService, PrismaService],
  exports: [TaskService]
})
export class TaskModule { }
