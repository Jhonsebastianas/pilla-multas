import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { InfractionService } from '../application/infraction.service';
import { InfractionSyncValidatorService } from '../application/infraction-sync-validator.service';

@Controller('infractions')
@ApiTags('infractions')
export class InfractionController {
  constructor(
    private readonly infractionService: InfractionService,
    private readonly syncValidator: InfractionSyncValidatorService,
  ) {}

  private getUserId(headers: Record<string, string>): string {
    // Mock user for testing, integrate with JWT Guard later
    return headers['x-user-id'] || '65b2d2f8e1234567890abcde'; 
  }

  @Post('report')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Report a new traffic infraction with an image evidence.' })
  async reportInfraction(
    @Headers() headers: Record<string, string>,
    @UploadedFile() file: Express.Multer.File,
    @Body('latitude') latitude: string,
    @Body('longitude') longitude: string,
    @Body('description') description?: string,
  ) {
    const userId = this.getUserId(headers);
    return await this.infractionService.reportInfraction(
      userId,
      file,
      parseFloat(latitude),
      parseFloat(longitude),
      description,
    );
  }

  @Get('my-reports')
  @ApiOperation({ description: 'Get all infractions reported by the current user.' })
  async getMyInfractions(@Headers() headers: Record<string, string>) {
    const userId = this.getUserId(headers);
    return await this.infractionService.getInfractionsByUser(userId);
  }

  @Post('validate-sync')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Sync validation of an image for testing purposes.' })
  async validateSync(@UploadedFile() file: Express.Multer.File) {
    return await this.syncValidator.validateImageSync(file);
  }
}
