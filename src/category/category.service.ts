import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';
import { Product, Category, Prisma } from '@prisma/client';
import { time } from 'console';

const CATEGORY_NOT_FOUND = "NO SUCH CATEGORY FOUND: "
const CATEGORY_EXISTS = "Category already exists: "
const CATEGORY_LENGTH = "Category name is too long"
const EXISTS = "Does not exist: "
const MAX_NAME_LENGTH = 25
const DATE_INVALID = "Not a valid date try YEAR-MONTH-DAY"
const NO_CATEGORY = "No categories were found"
const UPDATEDAT = "updatedat"
const DELETEDAT = "deletedat"
const CREATEDAT = "createdat"
const yearRegex = /^\d{4}$/
const monthRegex = /^\d{4}-\d{2}$/
const dayRegex = /^\d{4}-\d{2}-\d{2}$/

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}
    async myProducts(id: string, query: string[]) {
        const category = await this.prisma.category.findFirst({
            where: { name: id.toLowerCase(), deletedAt: null },
        });
        if (!category) {
            return {status: CATEGORY_NOT_FOUND + id}
        }
        const timeFilter = this.filterProductConstructor(query)
        if(Object.keys(timeFilter).length == 0) {
            return {mesage: DATE_INVALID}
        }
        const table = await this.prisma.productCategoriesIntermediate.findMany({
            where: {
                deletedAt: null,
                categoryID: category.id
            }
        })
        const productIDs = table.map(ob => ob.productID);
        timeFilter.id = {in: productIDs}
        const products = await this.prisma.product.findMany({
            where: timeFilter
        });
        return products
    }

    async newCategory(category: CategoryDto) {
        const categoryFound = await this.prisma.category.findFirst({
            where:{
                name: category.name.toLowerCase()
            }
        })
        const name = category.name
        if (categoryFound) {
            return {error: CATEGORY_EXISTS + name}
        }
        if(category.name.length > MAX_NAME_LENGTH) {
            return {error: CATEGORY_LENGTH}
        }
        const prismaCategory = this.prisma.category.create({
            data: {
                name: category.name.toLowerCase(),
                description: category.description,
            }
        })
        return prismaCategory
    }

    async deleteCategory(name: string) {
        const mycategory = await this.prisma.category.findFirst({
            where: { name: name.toLowerCase(), deletedAt: null },
        });
        if (!mycategory) {
            return {done: EXISTS, name}
        }
        return this.prisma.category.update({
            where: { id: mycategory.id },
            data: {
                deletedAt: new Date()
            }
        });
    }

    async all(query: string[]) {
        //Posible Filters: CreatedAt, UpdatedAt, DeletedAt, Status, Category
        const timeFilter = this.filterCategoryConstructor(query)
        if(Object.keys(timeFilter).length == 0) {
            return {mesage: DATE_INVALID}
        }
        const categories = await this.prisma.category.findMany({
            where: timeFilter
        });
        if (categories.length == 0) {
            return {message: NO_CATEGORY}
        }
        return categories
    }

    filterCategoryConstructor(query: string[]) : Prisma.CategoryWhereInput {    
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
     
    filterProductConstructor(query: string[]) : Prisma.ProductWhereInput {    
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