import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {CategoryService } from './category.service';
import { setDefaultResultOrder } from 'dns';
import { CategoryDto } from './dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get("get/:id")
    myProducts(@Param("id") id: string) {
        return this.categoryService.myProducts(id)
    }
    //@Body("products") products: Product[], @Body("description") description: string
    @Post("new")
    newCategory(@Body() category: CategoryDto) {
        return this.categoryService.newCategory(category)
    }

    //To add a product do it from products

    @Delete("delete/:id")
    deleteCategory(@Param("id") id: string) {
        return this.categoryService.deleteCategory(id)
    }
}