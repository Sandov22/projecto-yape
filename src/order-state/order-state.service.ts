import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { OrderStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderStateService{
    constructor(private prisma: PrismaService) {}

    async newState(state: OrderStateDto) {
        const existingState = await this.prisma.orderState.findUnique({
            where: { state: state.name },
        });
        if (existingState) {
            return {error: "State already exists"};
        }
        if (state.name.length > 25) {
            return {error: "State name is too long"};
        }
        return this.prisma.orderState.create({
            data: { state: state.name }
        });
    }

    async getStates() {
        return this.prisma.orderState.findMany({})
    }
}