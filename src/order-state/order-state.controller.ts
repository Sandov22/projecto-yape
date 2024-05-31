import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
    getStates() {
        return this.stateService.getStates()
    }
}