import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { OrderStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

const LENGTH = "State name is too long"
const NOT_EXISTANT = "Not Existant"
const CANT_DELETE_UNDELETABLE = "This status cannot be deleted"
const PLACEHOLDER = "placeholder"
const MESSAGE = "Deleted status, moved all orders to PLACEHOLDER"
const UNDELETABLE = ['created', 'processing', 'shipping', 'delivered']
const ALREADY_EXISTS = " already exists"

@Injectable()
export class OrderStateService{
    constructor(private prisma: PrismaService) {}

    async newState(state: OrderStateDto) {
        const existingState = await this.prisma.orderState.findUnique({
            where: { state: state.name.toLowerCase() },
        });
        if (existingState) {
            return {error: state.name.toUpperCase() +  ALREADY_EXISTS};
        }
        if (state.name.length > 25) {
            return {error: LENGTH};
        }
        return this.prisma.orderState.create({
            data: { state: state.name.toLowerCase() }
        });
    }

    async getStates() {
        return this.prisma.orderState.findMany({
            where: {
                deletedAt: null,
                state: {
                    not: PLACEHOLDER.toLowerCase()
                }
            }
        })
    }

    async delete(name: string) {
        if (UNDELETABLE.includes(name.toLowerCase())) {
            return {message: CANT_DELETE_UNDELETABLE}
        }
        const myStatus = await this.prisma.orderState.findFirst({
            where: { state: name.toLowerCase(), deletedAt: null },
            select: { id: true },
        });
        if (!myStatus) {
            return {done: NOT_EXISTANT}
        }
        const statusID = myStatus.id
        const orderIntermediates = await this.prisma.orderStatusIntermediate.findMany({
            where: { statusID: statusID },
        })
        const orderIDs = orderIntermediates.map(ob => ob.orderID)
        const oldOrderStates = await this.prisma.orderOldIntermediate.findMany({
            where: {orderID: {in: orderIDs}},
            orderBy: {
                createdAt: "desc"
            }
        })
        const leastOld = new Map();
        for (const status of oldOrderStates) {
            if (!leastOld.has(status.orderID)) {
                leastOld.set(status.orderID, status);
            }
        }
        const arrayOld = Array.from(leastOld.values())
        const oldIDs = arrayOld.map(ob => ob.id)
        await this.prisma.orderOldIntermediate.deleteMany({
            where: {id: {in: oldIDs}}
        })
        for (const status of arrayOld) {
            await this.prisma.orderStatusIntermediate.update({
                where: {
                  orderID: status.orderID,
                },
                data: {
                  statusID: status.oldID,
                },
            });
        }
        await this.prisma.orderState.update({
            where: {
              id: statusID
            },
            data: {
              deletedAt: new Date()
            },
        });
        return {message: MESSAGE}
    }
}