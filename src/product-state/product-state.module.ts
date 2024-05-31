import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductStateController } from './product-state.controller';
import { ProductStateService } from './product-state.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProductStateController],
    providers: [ProductStateService]
})
export class ProductStateModule {}
