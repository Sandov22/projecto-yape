import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto';
import { Category, Product } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';

const NO_SUCH_PRODUCT = "No such product found"
const PRODUCT_NEEDS_NAME = "Product needs name"
const REST_FORMAT = "Not in correct REST format"
const PRODUCT_EXISTS = "Product already exists"
const PRODUCT_TOO_LONG = "Product name is too long"
const NO_CATEGORY = "A category does not exist"
const INSTOCK  = "INSTOCK".toLowerCase()
const NO_SUCH_STATUS = "No such status found"
const NOT_EXISTANT = "Not Existant"
const NO_SUCH_CATEGORY = "No such category found"
const REGEX = /^\["[0-9a-zA-Z]+"(,"[0-9a-zA-Z]+")*\]$/
const DELETED = "Product has been deleted"

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async myStatus(nameProv: string) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv.toLowerCase() },
            select: { id: true, deletedAt: true },
        });
        if (!product) {
            return {product: NO_SUCH_PRODUCT}
        }
        if (product.deletedAt != null) {
            return {product: DELETED}
        }
        const statusID = await this.prisma.productStatusIntermediate.findFirst({
            where: { productID: product.id }
        })
        const status = await this.prisma.productState.findFirst({
            where: { id: statusID.statusID }
        })
        return {status: status}
    }

    async newProduct(product: ProductDto) {
        //["Food","Electronics","Health"]
        //Regex:   ^\[\"[0-9a-zA-Z]\"+(,\"[0-9a-zA-Z]\"+)*\]$
        //String by commas: ^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$
        //String by commas and []: ^\[[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*\]$
        //Something by "": "(.*?)"
        const {name, categories} = product
        if (!name) {
            return {error: PRODUCT_NEEDS_NAME}
        }
        const regex = REGEX;
        if( !regex.test(categories) ) {
            return {error: REST_FORMAT}
        }
        const nameFound = await this.prisma.product.findFirst({
            where:{
                name: name.toLowerCase()
            }
        })
        if (nameFound && nameFound.deletedAt != null) {
            return {error: DELETED}
        }
        if (nameFound) {
            return {error: PRODUCT_EXISTS}
        }
        if(name.length > 25) {
            return {error: PRODUCT_TOO_LONG}
        }

        let categoriesFound: Category[] = []
        const categoryAsString = categories.trim().slice(1, -1).toLowerCase()
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
            return {error: NO_CATEGORY}
        }
        const status = await this.prisma.productState.findFirst({
            where: {
                state: INSTOCK
            }
        })
        const childID = status.id
        const prismaProduct = await this.prisma.product.create({
            data: {
                name: name.toLowerCase(),
            }
        })
        const productID = prismaProduct.id
        const intermediate = await this.prisma.productStatusIntermediate.create({
            data: {
                productID: productID,
                statusID: childID
            }
        })
        for(let x = 0; x < categoriesFound.length; x++){
            await this.prisma.productCategoriesIntermediate.create({
                data: {
                    productID: productID,
                    categoryID: categoriesFound[x].id
                }
            })
        }

        return {prismaProduct, categoriesFound}
    }

    async updateStatus(nameProv: string, statusOb: { status: string }) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv.toLowerCase(), deletedAt: null }
        });
        if (!product) {
            return {product: NO_SUCH_PRODUCT }
        }
        const statusUp = await this.prisma.productState.findFirst({
            where: {
                state: statusOb.status.toLowerCase()
            }
        })
        if(!statusUp) {
            return {status: NO_SUCH_STATUS}
        }
        return this.prisma.productStatusIntermediate.update({
            where: { productID: product.id },
            data: { statusID: statusUp.id},
        });
    }

    async deleteProduct(name: string) {
        const myProduct = await this.prisma.product.findFirst({
            where: { name: name.toLowerCase(), deletedAt: null },
            select: { id: true },
        });
        if (!myProduct) {
            return {done: NOT_EXISTANT}
        }
        const productID = myProduct.id

        await this.prisma.productCategoriesIntermediate.updateMany({
            where: { productID: productID },
            data: {
                deletedAt: new Date()
            }
        })
        await this.prisma.orderProductsIntermediate.updateMany({
            where: { productID: productID },
            data: {
                deletedAt: new Date()
            }
        })
        await this.prisma.productStatusIntermediate.updateMany({
            where: { productID: productID },
            data: {
                deletedAt: new Date()
            }
        })
        return await this.prisma.product.update({
            where: { id: productID },
            data: {
                deletedAt: new Date()
            }
        });
    }

    async addCategory(nameProv: string, categoryOb: { category: string }) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv.toLowerCase(), deletedAt: null }
        });
        if (!product) {
            return {product: NO_SUCH_PRODUCT}
        }
        const categoryUp = await this.prisma.category.findFirst({
            where: {
                name: categoryOb.category.toLowerCase()
            }
        })
        if(!categoryUp) {
            return {category: NO_SUCH_CATEGORY}
        }
        return this.prisma.productCategoriesIntermediate.create({
            data: {
                productID: product.id,
                categoryID: categoryUp.id
            }
        });
    }

    async available() {
        const available = await this.prisma.productState.findFirst({
            where: {
                state: INSTOCK, deletedAt: null
            }
        })
        const availableID = available.id
        const statusProducts = await this.prisma.productStatusIntermediate.findMany({
            where: { statusID: availableID },
        });
      
        const productIDs = statusProducts.map(ob => ob.productID);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIDs } },
        });
        return products
    }

}