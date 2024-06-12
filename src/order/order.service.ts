import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderDto } from './dto';
import { Product, Order } from '@prisma/client';
import { NOTFOUND } from 'dns';

const NEED_PRODUCT = "Order needs products"
const REGEX = /^\["[0-9a-zA-Z]+"(,"[0-9a-zA-Z]+")*\]$/
const REST_FORMAT = "Not in correct REST format"
const TOO_LONG = "Order name is too long"
const NO_PRODUCTS = "NO PRODUCTS FOUND"
const CREATED = "CREATED".toLowerCase()
const NO_ORDER = "NO SUCH ORDER FOUND"

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}
    async myStatus(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: id.toLowerCase(), deletedAt: null }
        });
        if (!order) {
            return {order: `Order ${id} not found`}
        }
        const statusID = await this.prisma.orderStatusIntermediate.findFirst({
            where: {orderID: order.id}
        })
        const status = await this.prisma.orderState.findFirst({
            where: { id: statusID.statusID },
        });
        const productsTable = await this.prisma.orderProductsIntermediate.findMany({
            where: {orderID: order.id}
        })
        const productIDs = productsTable.map(ob => ob.productID);
        const products = await this.prisma.product.findMany({
            where: { id: {in: productIDs} }
        });
        const oldStatusesOb = await this.prisma.orderOldIntermediate.findMany({
            where: {orderID: order.id}
        })
        const oldStatusIDs = oldStatusesOb.map(ob => ob.oldID);
        const oldStatuses = await this.prisma.orderState.findMany({
            where: {id: {in: oldStatusIDs}},
            select: {id: true, state: true}
        })
        const mergedArray = oldStatuses.map(status => {
            const matchingOb = oldStatusesOb.find(ob => ob.oldID === status.id)
            return {
                id: status.id,
                state: status.state,
                createdat: matchingOb ? matchingOb.createdAt : null,
                deletedat: matchingOb ? matchingOb.deletedAt : null,
                updatedat: matchingOb ? matchingOb.updatedAt : null,
              }
        })
        const toReturn = {
            ...order,
            status: status,
            products: products,
            oldStatuses: mergedArray
        }
        return {toReturn}
    }

    async newOrder(order: OrderDto) {
        const {products} = order
        if (!products) {
            return {product: NEED_PRODUCT}
        }
        const regex = REGEX;
        if( !regex.test(products) ) {
            return {error: REST_FORMAT}
        }
        if(products.length > 100) {
            return {error: TOO_LONG}
        }
        
        let productObjects: Product[] = []
        const productAsString = products.trim().slice(1, -1).toLowerCase()
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
            return {product: NO_PRODUCTS}
        }
        const status = await this.prisma.orderState.findFirst({
            where: {
                state: CREATED
            }
        })
        const prismaOrder = await this.prisma.order.create({
            data: {
                description: order.description,
            }
        })
        let productArray = []
        for (let x = 0; x < productObjects.length; x++) {
            const addProducts = await this.prisma.orderProductsIntermediate.create({
                data: {
                    orderID: prismaOrder.id,
                    productID: productObjects[x].id
                }
            })
            productArray.push(addProducts)
        }
        const links = await this.prisma.orderStatusIntermediate.create({
            data: {
                orderID: prismaOrder.id,
                statusID: status.id
            }
        })
        const toReturn = {
            ...prismaOrder,
            productArray
        }
        return toReturn
    }

    async updateStatus(id: string, statusOb: { status: string }) {
        const order = await this.prisma.order.findUnique({
            where: { id: id, deletedAt: null },
        });
        if (!order) {
            return {order: NO_ORDER}
        }
        const statusOldID = await this.prisma.orderStatusIntermediate.findFirst({
            where: {orderID: order.id}
        })
        const statusUp = await this.prisma.orderState.findFirst({
            where: {
                state: statusOb.status.toLowerCase()
            }
        })
        if(!statusUp) {
            return {status: `Status ${statusOb.status.toUpperCase()} not found`}
        }
        const value = await this.prisma.orderStatusIntermediate.update({
            where: {orderID: order.id},
            data: { 
                orderID: order.id,
                statusID: statusUp.id,
             }
        })
        const old = await this.prisma.orderOldIntermediate.create({
            data: { 
                orderID: order.id,
                oldID: statusOldID.statusID,
                deletedAt: new Date()
             }
        })
        return order
    }

    async deleteOrder(id: string) {
        const myOrder = await this.prisma.order.findUnique({
            where: { id: id, deletedAt: null },
        });
        if (!myOrder) {
            return {done: NO_ORDER}
        }
        const orderID = myOrder.id
        await this.prisma.orderProductsIntermediate.updateMany({
            where: { orderID: orderID },
            data: {
                deletedAt: new Date()
            }
        })
        await this.prisma.orderStatusIntermediate.updateMany({
            where: { orderID: orderID },
            data: {
                deletedAt: new Date()
            }
        })
        return this.prisma.order.update({
            where: { id: id },
            data: {
                deletedAt: new Date()
            }
        });
    }

}

//9261f078-cff1-40a8-b0f7-4a087050f78d