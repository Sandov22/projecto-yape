import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { setDefaultResultOrder } from 'dns';
import { OrderDto } from './dto';
import { Status } from '@prisma/client';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get("get/:id")
    myStatus(@Param("id") id: string) {
        return this.orderService.myStatus(id)
    }
    //@Body("products") products: Product[], @Body("description") description: string
    @Post("new")
    newOrder(@Body() order: OrderDto) {
        return this.orderService.newOrder(order)
    }

    @Patch("update/:id")
    updateStatus(@Param("id") id: string, @Body() statusUp: { status: string }) {
        //console.log("RECEIVED", statusUp, id);
        return this.orderService.updateStatus(id, statusUp)
    }

}
