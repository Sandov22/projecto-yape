import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {CategoryService } from './category.service';
import { setDefaultResultOrder } from 'dns';
import { CategoryDto } from './dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get("get/:id")
    myProducts(@Param("id") id: string, @Query() query: string[]) {
        return this.categoryService.myProducts(id, query)
    }

    @Post("new")
    newCategory(@Body() category: CategoryDto) {
        return this.categoryService.newCategory(category)
    }

    @Delete("delete/:id")
    deleteCategory(@Param("id") id: string) {
        return this.categoryService.deleteCategory(id)
    }

    @Get("all")
    all(@Query() query: string[]) {
        return this.categoryService.all(query)
    }
}