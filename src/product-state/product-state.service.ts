import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ProductStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { isNonNullType } from "graphql";

const TOO_LONG = `State name is too long`
const NOT_EXISTANT = "Not Existant"
const CANT_DELETE_PLACEHOLDER = "Placeholder cannot be deleted"
const PLACEHOLDER = "placeholder"
const MESSAGE = "Deleted status, moved all products to PLACEHOLDER"

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
        return this.prisma.productState.findMany({
            where: {
                deletedAt: null,
                state: {
                    not: PLACEHOLDER.toLowerCase()
                }
            }
        })
    }

    async delete(name: string) {
        if (name.toLowerCase() === 'placeholder') {
            return CANT_DELETE_PLACEHOLDER
        }
        const myStatus = await this.prisma.productState.findFirst({
            where: { state: name.toLowerCase(), deletedAt: null },
            select: { id: true },
        });
        if (!myStatus) {
            return {done: NOT_EXISTANT}
        }
        const statusID = myStatus.id
        const placeholder = await this.prisma.productState.findFirst({
            where: {state: PLACEHOLDER}
        })
        await this.prisma.productStatusIntermediate.updateMany({
            where: { statusID: statusID },
            data: {
                statusID: placeholder.id
            }
        })
        await this.prisma.productState.updateMany({
            where: { id: myStatus.id },
            data: {
                deletedAt: new Date()
            }
        })
        return {message: MESSAGE}
    }
}