import { Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')

export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) { }

  @Get()
  async getAll() {
    return this.CategoryService.getAll()
  }

  @Post()
  async magrate() {
    return this.CategoryService.migrate()
  }

}

