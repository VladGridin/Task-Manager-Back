import {
  Controller,
  Get,
  Param,
  Put,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { FileValidationInterceptor } from './files.interceptor';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private UserService: UserService,
  ) {}

  @Put()
  @UseInterceptors(FileValidationInterceptor)
  @Auth()
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,

    @CurrentUser('id')
    id: string,
  ) {
    return this.UserService.updateImage(id, `/files/${file.filename}`);
  }

  @Get('/:filename')
  getFile(@Param('filename') fileName: string, @Response() res) {
    return this.filesService.getFile(fileName, res);
  }
}
