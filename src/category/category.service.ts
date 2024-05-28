import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';
import { Product, Category } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}
    async myProducts(id: string) {
        const category = await this.prisma.category.findFirst({
            where: { name: id },
            select: { products: true },
        });
        if (!category) {
            return {status: "NO SUCH CATEGORY FOUND"}
        }
        return {products: category.products}
    }

    async newCategory(category: CategoryDto) {
        const prismaCategory = this.prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
            }
        })
        return prismaCategory
    }

    async deleteCategory(id: string) {
        const idNum = Number(id)
        const mycategory = await this.prisma.category.findUnique({
            where: { id: idNum },
        });
        if (!mycategory) {
            return {done: "Not Existant"}
        }
        return this.prisma.category.delete({
            where: { id: idNum },
          });
    }
}