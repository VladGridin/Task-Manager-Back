import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { PrismaService } from 'src/prisma.service';
import { PomodoroController } from './pomodoro.controller';

@Module({
  controllers: [PomodoroController],
  providers: [PomodoroService, PrismaService],
  exports: [PomodoroService],
})
export class PomodoroModule {}
