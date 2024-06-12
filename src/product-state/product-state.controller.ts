import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ProductStateDto } from "./dto";
import { ProductStateService } from "./product-state.service";

@Controller('productstate')
export class ProductStateController {
    constructor(private stateService: ProductStateService) {}
    @Post("new")
    newState(@Body() state: ProductStateDto) {
        return this.stateService.newState(state)
    }

    @Get("get")
    getStates() {
        return this.stateService.getStates()
    }

    @Delete("delete/:name")
    delete(@Param("name") name: string,) {
        return this.stateService.delete(name)
    }
}