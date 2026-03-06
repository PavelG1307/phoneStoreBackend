import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CategoryService } from './category.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) { }

  @Get()
  async getAll() {
    return this.CategoryService.getAll()
  }

  @Post()
  @ApiCookieAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async magrate() {
    return this.CategoryService.migrate()
  }

}

