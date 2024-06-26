import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { StateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StateService{
    constructor(private prisma: PrismaService) {}
    /*
    async newState(state: StateDto) {
        const existingState = await this.prisma.state.findUnique({
            where: { state: state.name },
        });
        if (existingState) {
            return {error: "State already exists"};
        }
        if (state.name.length > 25) {
            return {error: "State name is too long"};
        }
        return this.prisma.state.create({
            data: { state: state.name, isOrder: Number(state.isOrder) },
        });
    }

    async getStates(isOrder: number) {
        return this.prisma.state.findMany({
            where: {isOrder: isOrder}
        });
    }
    */
}