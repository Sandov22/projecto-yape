import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { OrderStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

const LENGTH = "State name is too long"

@Injectable()
export class OrderStateService{
    constructor(private prisma: PrismaService) {}

    async newState(state: OrderStateDto) {
        const existingState = await this.prisma.orderState.findUnique({
            where: { state: state.name },
        });
        if (existingState) {
            return {error: `State ${state.name} already exists`};
        }
        if (state.name.length > 25) {
            return {error: LENGTH};
        }
        return this.prisma.orderState.create({
            data: { state: state.name }
        });
    }

    async getStates() {
        return this.prisma.orderState.findMany({})
    }
}