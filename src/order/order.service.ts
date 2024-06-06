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
            where: { id: id, deletedAt: null }
        });
        if (!order) {
            return {order: `Order ${id} not found`}
        }
        const childID = await this.prisma.orderStatusIntermediate.findFirst({
            where: {parentID: order.id}
        })
        const status = await this.prisma.orderState.findFirst({
            where: { id: childID.childID },
        });
        const productsTable = await this.prisma.orderProductsIntermediate.findMany({
            where: {parentID: order.id}
        })
        const productIDs = productsTable.map(ob => ob.childID);
        const products = await this.prisma.product.findMany({
            where: { id: {in: productIDs} }
        });
        const toReturn = {
            ...order,
            status: status,
            products: products
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
        if(products.length > 25) {
            return {error: TOO_LONG}
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
                    parentID: prismaOrder.id,
                    childID: productObjects[x].id
                }
            })
            productArray.push(addProducts)
        }
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

        const statusUp = await this.prisma.orderState.findFirst({
            where: {
                state: statusOb.status
            }
        })
        if(!statusUp) {
            return {status: `Status ${statusOb.status.toUpperCase()} not found`}
        }
        const value = await this.prisma.orderStatusIntermediate.create({
            data: { 
                parentID: order.id,
                childID: statusUp.id
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
        return this.prisma.order.update({
            where: { id: id },
            data: {
                deletedAt: new Date()
            }
          });
    }

}