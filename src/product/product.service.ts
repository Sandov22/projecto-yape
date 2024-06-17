import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto';
import { Category, Prisma, Product } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { log } from 'console';

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
const MAX_NAME_LENGTH = 25
const yearRegex = /^\d{4}$/
const monthRegex = /^\d{4}-\d{2}$/
const dayRegex = /^\d{4}-\d{2}-\d{2}$/
const DATE_INVALID = "Not a valid date try YEAR-MONTH-DAY"
const NO_PRODUCTS = "No products were found"
const UPDATEDAT = "updatedat"
const DELETEDAT = "deletedat"
const CREATEDAT = "createdat"

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}
    async myProduct(nameProv: string) {
        const product = await this.prisma.product.findFirst({
            where: { name: nameProv.toLowerCase(), deletedAt: null },
        });
        if (!product) {
            return {product: NO_SUCH_PRODUCT}
        }
        const statusID = await this.prisma.productStatusIntermediate.findFirst({
            where: { productID: product.id }
        })
        const status = await this.prisma.productState.findFirst({
            where: { id: statusID.statusID }
        })
        const toReturn = {
            product,
            status
        }
        return {product: toReturn}
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
        if(name.length > MAX_NAME_LENGTH) {
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

        return {product: prismaProduct, categories: categoriesFound}
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
        await this.prisma.productStatusIntermediate.update({
            where: { productID: product.id },
            data: { statusID: statusUp.id},
        });
        return statusUp
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
        await this.prisma.productCategoriesIntermediate.create({
            data: {
                productID: product.id,
                categoryID: categoryUp.id
            }
        });
        return categoryUp
    }

    async available(query: string[]) {
        const available = await this.prisma.productState.findFirst({
            where: {
                state: INSTOCK, deletedAt: null
            }
        })
        const availableID = available.id
        const statusProducts = await this.prisma.productStatusIntermediate.findMany({
            where: { statusID: availableID },
        });
        const timeFilter = this.filterConstructor(query)
        if(Object.keys(timeFilter).length == 0) {
            return {mesage: DATE_INVALID}
        }
        const productIDs = statusProducts.map(ob => ob.productID);
        timeFilter.id = { in: productIDs }
        const products = await this.prisma.product.findMany({
            where: timeFilter
        });
        if (products.length == 0) {
            return {message: NO_PRODUCTS}
        }
        return products
    }

    async all(query: string[]) {
        //Posible Filters: CreatedAt, UpdatedAt, DeletedAt, Status, Category
        const timeFilter = this.filterConstructor(query)
        if(Object.keys(timeFilter).length == 0) {
            return {mesage: DATE_INVALID}
        }
        const products = await this.prisma.product.findMany({
            where: timeFilter
        });
        if (products.length == 0) {
            return {message: NO_PRODUCTS}
        }
        return products
    }

    filterConstructor(query: string[]) : Prisma.ProductWhereInput {    
        if (query.length == 0) {return {deletedAt: null}}
        const keys = Object.keys(query)
        const alteredKeys = keys.map(ob => ob.toLowerCase())
        const values = Object.values(query)
        const alteredValues = values.map(ob => ob.toLowerCase())
        let timeFilters: any = {}
        if(alteredKeys.includes(CREATEDAT)) {
            const index = alteredKeys.indexOf(CREATEDAT)
            const value = alteredValues.at(index)
            if (!(yearRegex.test(value) || monthRegex.test(value) || dayRegex.test(value))) {
                return {}
            }
            const dateParts = (dateString) => {
                const parts = dateString.split('-');
                const year = parts[0];
                const month = parts[1] ? parts[1] : null;
                const day = parts[2] ? parts[2] : null;
                return { year, month, day };
            };
            const { year, month, day } = dateParts(value);
            let timeFilter = {
                  gte: new Date(year),
                  lt: new Date(`${year}-12-31T23:59:59.999Z`),
            };
            if (month) {
                const monthAsNum = Number(month)
                if (monthAsNum > 12 || monthAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}`);
                timeFilter.lt = new Date(`${year}-${month}-31T23:59:59.999Z`);
            }
            if (day) {
                const dayAsNum = Number(day)
                if (dayAsNum > 31 || dayAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}-${day}`);
                timeFilter.lt = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
            }
            timeFilters.createdAt = timeFilter
        }
        if(alteredKeys.includes(DELETEDAT)) {
            const index = alteredKeys.indexOf(DELETEDAT)
            const value = alteredValues.at(index)
            if (!(yearRegex.test(value) || monthRegex.test(value) || dayRegex.test(value))) {
                return {}
            }
            const dateParts = (dateString) => {
                const parts = dateString.split('-');
                const year = parts[0];
                const month = parts[1] ? parts[1] : null;
                const day = parts[2] ? parts[2] : null;
                return { year, month, day };
            };
            const { year, month, day } = dateParts(value);
            let timeFilter = {
                  gte: new Date(year),
                  lt: new Date(`${year}-12-31T23:59:59.999Z`),
            };
            if (month) {
                const monthAsNum = Number(month)
                if (monthAsNum > 12 || monthAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}`);
                timeFilter.lt = new Date(`${year}-${month}-31T23:59:59.999Z`);
            }
            if (day) {
                const dayAsNum = Number(day)
                if (dayAsNum > 31 || dayAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}-${day}`);
                timeFilter.lt = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
            }
            timeFilters.deletedAt = timeFilter
        }
        else { timeFilters.deletedAt = null }
        if(alteredKeys.includes(UPDATEDAT)) {
            const index = alteredKeys.indexOf(UPDATEDAT)
            const value = alteredValues.at(index)
            if (!(yearRegex.test(value) || monthRegex.test(value) || dayRegex.test(value))) {
                return {}
            }
            const dateParts = (dateString) => {
                const parts = dateString.split('-');
                const year = parts[0];
                const month = parts[1] ? parts[1] : null;
                const day = parts[2] ? parts[2] : null;
                return { year, month, day };
            };
            const { year, month, day } = dateParts(value);
            let timeFilter = {
                gte: new Date(year),
                lt: new Date(`${year}-12-31T23:59:59.999Z`),
            };
            if (month) {
                const monthAsNum = Number(month)
                if (monthAsNum > 12 || monthAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}`);
                timeFilter.lt = new Date(`${year}-${month}-31T23:59:59.999Z`);
            }
            if (day) {
                const dayAsNum = Number(day)
                if (dayAsNum > 31 || dayAsNum < 1) {
                    return {}
                }
                timeFilter.gte = new Date(`${year}-${month}-${day}`);
                timeFilter.lt = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
            }
            timeFilters.updatedAt = timeFilter
        }
        return timeFilters
    }

}