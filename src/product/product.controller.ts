import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get("get/:id")
    myStatus(@Param("id") id: string) {
        return this.productService.myStatus(id)
    }
    
    @Post("new")
    newOrder(@Body() order: ProductDto) {
        return this.productService.newProduct(order)
    }

    @Patch("updatestatus/:id")
    updateStatus(@Param("id") id: string, @Body() statusUp: { status: string }) {
        return this.productService.updateStatus(id, statusUp)
    }

    @Patch("addcategory/:id")
    addCategory(@Param("id") id: string, @Body() categoryUp: { category: string }) {
        return this.productService.addCategory(id, categoryUp)
    }

    @Delete("delete/:name")
    deleteOrder(@Param("name") name: string) {
        return this.productService.deleteProduct(name)
    }

    @Get("available")
    available(){
        return this.productService.available()
    }
}
