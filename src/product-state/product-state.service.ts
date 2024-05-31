import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ProductStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductStateService{
    constructor(private prisma: PrismaService) {}

    async newState(state: ProductStateDto) {
        const existingState = await this.prisma.productState.findUnique({
            where: { state: state.name },
        });
        if (existingState) {
            return {error: "State already exists"};
        }
        if (state.name.length > 25) {
            return {error: "State name is too long"};
        }
        return this.prisma.productState.create({
            data: { state: state.name },
        });
    }

    async getStates() {
        return this.prisma.productState.findMany({})
    }
}