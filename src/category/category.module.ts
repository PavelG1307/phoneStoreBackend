import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/models/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
    controllers: [CategoryController],
    providers: [CategoryService],
    imports: [SequelizeModule.forFeature([Category])]})
export class CategoryModule {}
