import { Controller, Get, Post } from '@nestjs/common';
import { RollbarHandler } from 'nestjs-rollbar';
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
  async magrate() {
    return this.CategoryService.migrate()
  }

}

