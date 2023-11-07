import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { StorageService } from './storage.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@ApiCookieAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly StorageService: StorageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.StorageService.upload(file)
  }
}

