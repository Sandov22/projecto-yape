import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ProductStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

const TOO_LONG = `State name is too long`


@Injectable()
export class ProductStateService{
    constructor(private prisma: PrismaService) {}
    
    async newState(state: ProductStateDto) {
        const existingState = await this.prisma.productState.findUnique({
            where: { state: state.name.toLowerCase() },
        });
        if (existingState) {
            return {error: `State ${state.name.toUpperCase()} already exists`};
        }
        if (state.name.length > 25) {
            return {error: TOO_LONG};
        }
        return this.prisma.productState.create({
            data: { state: state.name.toLowerCase() },
        });
    }

    async getStates() {
        return this.prisma.productState.findMany({})
    }
}