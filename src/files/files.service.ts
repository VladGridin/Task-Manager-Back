import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FilesService {
  constructor(private readonly UserService: UserService) {}

  uploadFile(file: string, id: string) {
    console.log('WOrk');
    return this.UserService.updateImage(id, `/files/${file}`);

    // return res.json({
    //   filename: `/files/${file}`,
    // });
  }

  getFile(filename: string, res: Response) {
    const filepath = join(process.cwd(), 'uploads', filename);
    return res.sendFile(filepath);
  }
}
