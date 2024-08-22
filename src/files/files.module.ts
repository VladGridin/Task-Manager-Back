import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [UserModule],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
