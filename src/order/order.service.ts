import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDto } from './dto';
import { Product, Order } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}
    async myStatus(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: parseInt(id, 10) },
            select: { status: true },
        });
        if (!order) {
            return {order: "NO SUCH ORDER FOUND"}
        }
        return {status: order.status.state}
    }

    async newOrder(order: OrderDto) {
        const {products} = order
        if (!products) {
            return {product: "Order needs products"}
        }
        const regex = /^\["[0-9a-zA-Z]+"(,"[0-9a-zA-Z]+")*\]$/;
        if( !regex.test(products) ) {
            return {error: "Not in correct REST format"}
        }

        if(products.length > 25) {
            return {error: "Order name is too long"}
        }
        
        let productObjects: Product[] = []
        const productAsString = products.trim().slice(1, -1)
        const productSeparated = productAsString.split(',')
        let productNames = productSeparated
        for(let i = 0; i < productSeparated.length; i++){
            productNames[i] = productNames[i].trim().slice(1, -1)
        }
        productObjects = await this.prisma.product.findMany({
            where: {
                name: {
                in: productNames
                },
            },
        });

        if(productObjects.length === 0) {
            return {product: "NO PRODUCTS FOUND"}
        }

        const prismaOrder = await this.prisma.order.create({
            data: {
                products: {
                    connect: productObjects
                },
                description: order.description,
                statusID: 1
            }
        })
        return prismaOrder
    }

    async updateStatus(id: string, statusOb: { status: string }) {
        const order = await this.prisma.order.findUnique({
            where: { id: parseInt(id, 10) },
            select: { status: true, statusID: true },
        });
        if (!order) {
            return {order: "NO SUCH ORDER FOUND"}
        }

        const statusUp = await this.prisma.orderState.findFirst({
            where: {
                state: statusOb.status
            }
        })
        if(!statusUp) {
            return {status: "NO SUCH STATUS FOUND"}
        }
        const appendedStatus = order.statusID
        const value = await this.prisma.order.update({
            where: {id: parseInt(id, 10) },
            data: { oldStatus: {push: appendedStatus} }
        })

        
        return this.prisma.order.update({
            where: { id: parseInt(id, 10) },
            data: { statusID: statusUp.id},
        });
    }

    async deleteOrder(id: string) {
        const idNum = Number(id)
        const myOrder = await this.prisma.order.findUnique({
            where: { id: idNum },
        });
        if (!myOrder) {
            return {done: "Not Existant"}
        }
        return this.prisma.order.delete({
            where: { id: idNum },
          });
    }
}