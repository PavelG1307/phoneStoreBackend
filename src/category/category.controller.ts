import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CategoryService } from './category.service';

@Controller('category')

export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) { }

  @Get()
  @RollbarHandler()
  async getAll() {
    return this.CategoryService.getAll()
  }

  @Post()
  @RollbarHandler()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async magrate() {
    return this.CategoryService.migrate()
  }

}

