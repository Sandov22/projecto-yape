import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StateDto } from "./dto";
import { StateService } from "./state.service";

@Controller('state')
export class StateController {
    constructor(private stateService: StateService) {}
    /*
    @Post("new")
    newState(@Body() state: StateDto) {
        return this.stateService.newState(state)
    }

    @Get("get/:isorder")
    getStates(@Param("isorder") isorder: string) {
        return this.stateService.getStates(Number(isorder))
    }
    */
}