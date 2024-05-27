import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDto } from './dto';
import { Product, Status, Order } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}
    async myStatus(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: parseInt(id, 10) },
            select: { status: true },
        });
        return {status: order.status}
    }

    async newOrder(order: OrderDto) {
        
        const productObjects: Product[] = await this.prisma.product.findMany({
            where: {
              id: {
                in: order.products.split(',').map(id => parseInt(id.trim(), 10)),
                },
            },
        });
    
        const prismaOrder = this.prisma.order.create({
            data: {
                products: {
                    connect: productObjects
                },
                status: "CREATED",
                description: order.description,
            }
        })
        return prismaOrder
    }

    async updateStatus(id: string, statusOb: { status: string }) {
        const order = await this.prisma.order.findUnique({
            where: { id: parseInt(id, 10) },
            select: { status: true },
        });
        const appendedStatus = order.status
        const value = await this.prisma.order.update({
            where: {id: parseInt(id, 10) },
            data: { oldStatus: {push: appendedStatus} }
        })
        
        const statusUp = statusOb.status
        if (statusUp === 'CREATED') {
            return this.prisma.order.update({
                where: { id: parseInt(id, 10) },
                data: { status: Status.CREATED,  },
            });
          } else if (statusUp === 'PROCESSING') {
            //console.log("FOUND");
            return this.prisma.order.update({
                where: { id: parseInt(id, 10) },
                data: { status: Status.PROCESSING },
            });
          } else if (statusUp === 'SHIPPING') {
            //console.log("FOUND");
            return this.prisma.order.update({
                where: { id: parseInt(id, 10) },
                data: { status: Status.SHIPPING },
            });
          } else if (statusUp === 'DELIVERED') {
            return this.prisma.order.update({
                where: { id: parseInt(id, 10) },
                data: { status: Status.DELIVERED },
            });
          } else {
            throw new Error(`Invalid status value: ${statusUp}`);
          }

        //console.log(order2.status, order2.id)
    }
}