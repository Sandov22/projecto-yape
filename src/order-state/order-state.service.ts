import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { OrderStateDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

const LENGTH = "State name is too long"
const NOT_EXISTANT = "Not Existant"
const CANT_DELETE_UNDELETABLE = "This status cannot be deleted"
const PLACEHOLDER = "placeholder"
const MESSAGE = "Deleted status, moved all orders to PLACEHOLDER"
const UNDELETABLE = ['created', 'processing', 'shipping', 'delivered']
const ALREADY_EXISTS = " already exists"
const desc = "desc"
const DATE_INVALID = "Not a valid date try YEAR-MONTH-DAY"
const NO_CATEGORY = "No categories were found"
const UPDATEDAT = "updatedat"
const DELETEDAT = "deletedat"
const CREATEDAT = "createdat"
const yearRegex = /^\d{4}$/
const monthRegex = /^\d{4}-\d{2}$/
const dayRegex = /^\d{4}-\d{2}-\d{2}$/



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

    async getStates(query: string[]) {
        const timeFilter = this.filterConstructor(query)
        timeFilter.state = {not: PLACEHOLDER.toLowerCase()}
        return this.prisma.orderState.findMany({where: timeFilter})
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
                createdAt: desc
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
        const toReturn = await this.prisma.orderState.update({
            where: {
              id: statusID
            },
            data: {
              deletedAt: new Date()
            },
        });
        return toReturn
    }

    filterConstructor(query: string[]) : Prisma.OrderStateWhereInput {    
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