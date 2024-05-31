import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderStateController } from './order-state.controller';
import { OrderStateService } from './order-state.service';

@Module({
    imports: [PrismaModule],
    controllers: [OrderStateController],
    providers: [OrderStateService]
})
export class OrderStateModule {}
