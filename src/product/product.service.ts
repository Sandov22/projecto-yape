import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto';
import { Category, Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async myStatus(nameProv: string) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv },
            select: { status: true },
        });
        if (!product) {
            return {product: "NO SUCH PRODUCT FOUND"}
        }
        return {status: product.status.state}
    }

    async newProduct(product: ProductDto) {
        const {name, categories} = product
        let categoriesFound: Category[] = []
        if (!categories) {
        } else {
            const categoryNames = categories.split(',').map(name => name.trim());
            categoriesFound = await this.prisma.category.findMany({
                where: {
                name: {
                    in: categoryNames
                    },
                },
            });
        }
    
        const prismaProduct = this.prisma.product.create({
            data: {
                statusID: 5,
                name: name,
                categories: {
                    connect: categoriesFound
                }
            }
        })
        return prismaProduct
    }

    async updateStatus(nameProv: string, statusOb: { status: string }) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv },
            select: { status: true, statusID: true, id: true },
        });
        if (!product) {
            return {product: "NO SUCH PRODUCT FOUND"}
        }
        
        const statusUp = await this.prisma.state.findFirst({
            where: {
                state: statusOb.status
            }
        })
        if(!statusUp) {
            return {status: "NO SUCH STATUS FOUND"}
        }
        if(statusUp.isOrder === 0) {
            return {status: "NO SUCH STATUS FOUND"}
        }
        return this.prisma.product.update({
            where: { id: product.id },
            data: { statusID: statusUp.id},
        });
    }

    async deleteProduct(name: string) {
        const myProduct = await this.prisma.product.findFirst({
            where: { name: name },
            select: { id: true },
        });
        if (!myProduct) {
            return {done: "Not Existant"}
        }
        return this.prisma.product.delete({
            where: { id: myProduct.id },
          });
    }

    async addCategory(nameProv: string, categoryOb: { category: string }) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv },
            select: { id: true, categories: true },
        });
        if (!product) {
            return {product: "NO SUCH PRODUCT FOUND"}
        }
        const categoryUp = await this.prisma.category.findFirst({
            where: {
                name: categoryOb.category
            }
        })
        if(!categoryUp) {
            return {category: "NO SUCH CATEGORY FOUND"}
        }
        return this.prisma.product.update({
            where: { id: product.id },
            data: { 
                categories: {
                    connect: {id: categoryUp.id}
                } 
            },
        });
    }

}