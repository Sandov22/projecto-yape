import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { OrderStateDto } from "./dto";
import { OrderStateService } from "./order-state.service";

@Controller('orderstate')
export class OrderStateController {
    constructor(private stateService: OrderStateService) {}
    @Post("new")
    newState(@Body() state: OrderStateDto) {
        return this.stateService.newState(state)
    }

    @Get("get")
    getStates(@Query() query: string[]) {
        return this.stateService.getStates(query)
    }

    @Delete("delete/:name")
    delete(@Param("name") name: string,) {
        return this.stateService.delete(name)
    }
}