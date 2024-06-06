import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';
import { Product, Category } from '@prisma/client';

const CATEGORY_NOT_FOUND = "NO SUCH CATEGORY FOUND: "
const CATEGORY_EXISTS = "Category already exists: "
const CATEGORY_LENGTH = "Category name is too long"
const EXISTS = "Does not exist: "

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}
    async myProducts(id: string) {
        const category = await this.prisma.category.findFirst({
            where: { name: id, deletedAt: null },
        });
        if (!category) {
            return {status: CATEGORY_NOT_FOUND + id}
        }
        const table = await this.prisma.productCategoriesIntermediate.findMany({
            where: {
                deletedAt: null,
                childID: category.id
            }
        })
        const productIDs = table.map(ob => ob.childID);
        const products = await this.prisma.product.findMany({
            where: { id: {in: productIDs} }
        });
        return {products: products}
    }

    async newCategory(category: CategoryDto) {
        const categoryFound = await this.prisma.category.findFirst({
            where:{
                name: category.name
            }
        })
        const name = category.name
        if (categoryFound) {
            return {error: CATEGORY_EXISTS + name}
        }
        if(category.name.length > 25) {
            return {error: CATEGORY_LENGTH}
        }
        const prismaCategory = this.prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
            }
        })
        return prismaCategory
    }

    async deleteCategory(id: string) {
        const mycategory = await this.prisma.category.findFirst({
            where: { name: id, deletedAt: null },
        });
        if (!mycategory) {
            return {done: EXISTS, id}
        }
        return this.prisma.category.update({
            where: { id: mycategory.id },
            data: {
                deletedAt: new Date()
            }
        });
    }
}