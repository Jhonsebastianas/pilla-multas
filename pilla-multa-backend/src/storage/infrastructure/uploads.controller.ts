import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@Controller('uploads')
@ApiTags('uploads')
export class UploadsController {
  @Get('*path')
  serveFile(@Param('path') filePath: string | string[], @Res() res: Response) {
    if (!filePath || filePath.length === 0) {
      throw new NotFoundException('Ruta de archivo no especificada');
    }
    const normalizedPath = Array.isArray(filePath) ? filePath.join('/') : filePath;
    const absolutePath = path.resolve(process.cwd(), 'uploads', normalizedPath);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return res.sendFile(absolutePath);
  }
}
