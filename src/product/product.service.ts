import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto';
import { Category, Product } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';

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
        //["Food","Electronics","Health"]
        //Regex:   ^\[\"[0-9a-zA-Z]\"+(,\"[0-9a-zA-Z]\"+)*\]$
        //String by commas: ^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$
        //String by commas and []: ^\[[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*\]$
        //Something by "": "(.*?)"
        const {name, categories} = product
        if (!name) {
            return {error: "Product needs name"}
        }
        const regex = /^\["[0-9a-zA-Z]+"(,"[0-9a-zA-Z]+")*\]$/;
        if( !regex.test(categories) ) {
            return {error: "Not in correct REST format"}
        }
        const nameFound = await this.prisma.product.findFirst({
            where:{
                name: name
            }
        })

        if (nameFound) {
            return {error: "Product already exists"}
        }
        if(name.length > 25) {
            return {error: "Product name is too long"}
        }

        let categoriesFound: Category[] = []
        const categoryAsString = categories.trim().slice(1, -1)
        const categorySeparated = categoryAsString.split(',')
        
        let categoryNames = categorySeparated
        for(let i = 0; i < categorySeparated.length; i++){
            categoryNames[i] = categoryNames[i].trim().slice(1, -1)
        }
        
        categoriesFound = await this.prisma.category.findMany({
            where: {
            name: {
                in: categoryNames
                },
            },
        });
        if (categoriesFound.length != categoryNames.length) {
            return {error: "A category does not exist"}
        }
    
        const prismaProduct = this.prisma.product.create({
            data: {
                statusID: 2,
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
        
        const statusUp = await this.prisma.productState.findFirst({
            where: {
                state: statusOb.status
            }
        })
        if(!statusUp) {
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