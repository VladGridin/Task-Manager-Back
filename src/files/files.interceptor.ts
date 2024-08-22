import { BadGatewayException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const FileValidationInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const generateRandomFileName = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(23).substring(2, 5);
      const OriginalName = file.originalname;
      const fileType = OriginalName.split('.')[1];
      const TypesList: string[] = ['jpg', 'png', 'gif', 'webp', 'flif'];
      if (!TypesList.includes(fileType)) {
        return callback(new BadGatewayException('not valid file'), null);
      }
      callback(null, `${generateRandomFileName()}.${fileType}`);
    },
  }),
});
